import { useState, useRef } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [videoElement, setVideoElement] = useState();
  const searchRef = useRef("");
  const API_KEY = "AIzaSyAuBs4qPSlUrVK11ZFBjCv81iN64lOYmhs";
  const MAX_RESULTS = 3;
  const URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&maxResults=${MAX_RESULTS}&type=video`;
  const [results, setResults] = useState([]);
  let current = 0;
  const [videoCode, setVideoCode] = useState();
  const [muted, setMuted] = useState(false);

  const play = () => {
    console.log(videoElement);
    if (isPaused === true) {
      videoElement.playVideo();
      setIsPaused(false);
    }
    if (isPaused === false) {
      videoElement.pauseVideo();
      setIsPaused(true);
    }
  };
  const mute = () => {
    console.log(videoElement);
    if (videoElement.isMuted() === true) {
      videoElement.unMute();
      setMuted(false);
    }
    if (videoElement.isMuted() === false) {
      videoElement.mute();
      setMuted(true);
    }
  };

  const options = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };
  const _onReady = (event) => {
    setVideoElement(event.target);
    event.target.unMute();
    event.target.isMuted() ? setMuted(true) : setMuted(false);
  };

  const search = () => {
    axios.get(URL + "&q=" + searchRef.current.value).then((data) => {
      setResults(data.data.items);
      console.log(data.data.items);
    });
  };

  const display = (i) => {
    console.log(results[i]);
    current = i;
    setVideoCode(results[current].id.videoId);
  };

  const next = () => {
    current++;
    setVideoCode(results[current].id.videoId);
  }

  return (
    <div className="App" loading="lazy">
      <header className="App-header">
        <YouTube
          videoId={videoCode}
          opts={options}
          onStateChange={(e) => _onReady(e)}
          onReady={(e) => _onReady(e)}
          loading="lazy"
          style={{ pointerEvents: "none" }}
          onEnd={() => next()}
          onError={() => next()}
        />
        {videoElement !== "" && videoCode ? (
          <p loading="lazy">{videoElement.videoTitle}</p>
        ) : (
          ""
        )}
        <br />
        <button onClick={() => play()}>{isPaused ? "Play" : "Pause"}</button>
        <button onClick={() => mute()}>{muted ? "Unmute" : "Mute"}</button>
        <br />
        <br />
        <input
          type="text"
          placeholder="Embed code"
          onChange={(e) => setUrl(e.target.value)}
        />
        <input type="text" placeholder="search videos" ref={searchRef} />
        <button onClick={() => search()}>Search</button>
        <div className="wrap">
          {results.length > 0
            ? results.map((result, i) => (
                <div
                  key={result.etag}
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => display(i)}
                >
                  <img
                    src={result.snippet.thumbnails.default.url}
                    style={{
                      height: result.snippet.thumbnails.default.height,
                      width: result.snippet.thumbnails.default.width,
                    }}
                  ></img>
                  <div className="con" style={{ marginLeft: "5px" }}>
                    <h3 style={{ marginTop: "5px" }}>{result.snippet.title}</h3>
                    <p style={{ marginTop: "5px" }}>
                      {result.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </header>
    </div>
  );
}

export default App;
