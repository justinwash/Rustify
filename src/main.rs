#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;
extern crate tokio_core;
extern crate librespot;

use std::thread;

use web_view::*;
// use std::io;
use tokio_core::reactor::Core;

use librespot::core::authentication::Credentials;
use librespot::core::config::SessionConfig;
use librespot::core::session::Session;
use librespot::core::spotify_id::SpotifyId;
use librespot::playback::config::PlayerConfig;
use librespot::playback::audio_backend;
use librespot::playback::player::Player;

fn main() {
    create_webview().expect("Error creating webview");
}

fn create_webview() -> WVResult {
    let html = format!(
        include_str!("./web/index.html"),
        style = include_str!("./web/index.css"),
        script = include_str!("./web/index.js") ,
        vue = include_str!("./web/dep/vue.min.js")
    );

    let webview = web_view::builder()
        .title("Rustify")
        .content(Content::Html(html))
        .size(600, 600)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use Cmd::*;

            match serde_json::from_str(arg).unwrap() {
                Init => (),
                Log { text } => println!("{}", text),
                Play { song } => {
                    thread::spawn(move || {
                        let mut core = Core::new().unwrap();
                        let handle = core.handle();
    
                        let session_config = SessionConfig::default();
                        let player_config = PlayerConfig::default();
    
                        let username = String::from("");
                        let password = String::from("");
        
                        let credentials = Credentials::with_password(username, password);
    
                        let track = SpotifyId::from_base62(&song.id).unwrap();
    
                        let backend = audio_backend::find(None).unwrap();
    
                        println!("Connecting ..");
                        let session = core
                            .run(Session::connect(session_config, credentials, None, handle))
                            .unwrap();
    
                        let (player, _) = Player::new(player_config, session.clone(), None, move || (backend)(None));
    
                        println!("Playing {} by {}", song.title, song.artist);
                        core.run(player.load(track, true, 0)).unwrap();
    
                        println!("Done");
                    });
                }
            }   
            Ok(())
        })
        .build()?;

    webview.run()
}

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    Log { text: String },
    Play { song: Track },
}

#[derive(Deserialize)]
pub struct Track {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub length: u32
}