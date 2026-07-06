 <img src={heroImg} className="hero" />

          <h2>Welcome 👋</h2>

          <div className="cards">
            <div className="card">
              <span>🔥</span>
              <h3>Trending</h3>
            </div>

            <div className="card">
              <span>📦</span>
              <h3>Orders</h3>
            </div>

            <div className="card">
              <span>💬</span>
              <h3>Messages</h3>
            </div>

            <div className="card">
              <span>⚙️</span>
              <h3>Settings</h3>
            </div>
          </div>

          <div className="list">
            {[1, 2, 3, 4].map((item) => (
              <div className="listItem" key={item}>
                <div className="avatar">{item}</div>

                <div>
                  <h4>Demo Item {item}</h4>
                  <p>Lorem ipsum dolor sit amet.</p>
                </div>
              </div>
            ))}
          </div>