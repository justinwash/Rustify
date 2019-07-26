extern crate webview;

use webview::{Content, WebView};

fn main() {
    let html = format!(
        include_str!("./web/index.html"),
        style = include_str!("./web/index.css"),
        script = include_str!("./web/index.js") 
    );

    let view = WebView::new(
        "Rustify",                               // The title of the window
        Content::Html(html), // The content to display
        480,                                     // Width
        640,                                     // Height
        true,                                    // Resizable?
        true,                                    // Debugable?
    )
    .unwrap();

    // Starts the event loop
    view.join();
}
