#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;

use web_view::*;

use rspotify::spotify::client::Spotify;
use rspotify::spotify::util::get_token;
use rspotify::spotify::oauth2::{SpotifyClientCredentials, SpotifyOAuth};

fn main() -> WVResult {
    let mut oauth = SpotifyOAuth::default()
        .scope("playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private")
        .build();

    match get_token(&mut oauth) {
        Some(token_info) => {
            let client_credential = SpotifyClientCredentials::default()
                .token_info(token_info)
                .build();

            let spotify = Spotify::default()
                .client_credentials_manager(client_credential)
                .build();
            
            let mut tekken_time_id = String::from("1lfiYGhqUgKvernVxawzFo");
            let tekken_time = spotify.user_playlist(&spotify.me().unwrap().id, Some(&mut tekken_time_id), None, None);

            println!("{:#?}", tekken_time);
        }
        None => println!("auth failed"),
    };

    let html = format!(
        include_str!("./web/index.html"),
        style = include_str!("./web/index.css"),
        script = include_str!("./web/index.js") ,
        jquery = include_str!("./web/dep/jquery.min.js")
    );

    let webview = web_view::builder()
        .title("Dialog example")
        .content(Content::Html(html))
        .size(480, 600)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, arg| {
            use Cmd::*;

            match serde_json::from_str(arg).unwrap() {
                Init => (),
                Log { text } => println!("{}", text),
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
}