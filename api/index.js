export default function handler(req, res) {
  const initialData = {
    title: "Welcome to Alpine.js SSR",
    description: "A simple homepage with server-side rendering and client-side interactivity",
    serverTime: new Date().toISOString(),
    stats: {
      users: Math.floor(Math.random() * 1000) + 500,
      posts: Math.floor(Math.random() * 100) + 50,
      comments: Math.floor(Math.random() * 500) + 200
    }
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${initialData.title}</title>
    <meta name="description" content="${initialData.description}">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        .stat-card:hover {
            border-color: #667eea;
            transform: translateY(-2px);
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        .actions {
            margin: 2rem 0;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 1rem;
            margin-bottom: 0.5rem;
            transition: background 0.3s ease;
        }
        button:hover {
            background: #5a6fd8;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 6px;
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
        }
        .loading {
            color: #666;
            font-style: italic;
        }
        .counter {
            background: #f0f7ff;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="container" x-data="appData()">
        <h1 x-text="pageData.title"></h1>
        <p x-text="pageData.description"></p>

        <div class="counter">
            <h3>Interactive Counter</h3>
            <p>Count: <strong x-text="counter"></strong></p>
            <button @click="counter++">Increment</button>
            <button @click="counter--" :disabled="counter <= 0">Decrement</button>
            <button @click="counter = 0">Reset</button>
        </div>

        <h2>Live Stats</h2>
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" x-text="pageData.stats.users"></div>
                <div>Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" x-text="pageData.stats.posts"></div>
                <div>Posts</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" x-text="pageData.stats.comments"></div>
                <div>Comments</div>
            </div>
        </div>

        <div class="actions">
            <h3>API Interactions</h3>
            <button @click="fetchNewStats()" :disabled="loading">
                <span x-show="!loading">Refresh Stats</span>
                <span x-show="loading">Loading...</span>
            </button>
            <button @click="fetchMessage()">Get Random Message</button>
            <button @click="sendData()">Send Sample Data</button>
        </div>

        <div x-show="message" class="message" x-text="message"></div>

        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; color: #666; font-size: 0.9rem;">
            <p>Server rendered at: <span x-text="pageData.serverTime"></span></p>
            <p>Client loaded at: <span x-text="clientTime"></span></p>
        </div>
    </div>

    <script>
        function appData() {
            return {
                pageData: ${JSON.stringify(initialData)},
                counter: 0,
                loading: false,
                message: '',
                clientTime: new Date().toISOString(),

                async fetchNewStats() {
                    this.loading = true;
                    try {
                        const response = await fetch('/api/stats');
                        const data = await response.json();
                        this.pageData.stats = data.stats;
                        this.message = 'Stats refreshed successfully!';
                    } catch (error) {
                        this.message = 'Error fetching stats: ' + error.message;
                    } finally {
                        this.loading = false;
                    }
                },

                async fetchMessage() {
                    try {
                        const response = await fetch('/api/message');
                        const data = await response.json();
                        this.message = data.message;
                    } catch (error) {
                        this.message = 'Error fetching message: ' + error.message;
                    }
                },

                async sendData() {
                    try {
                        const response = await fetch('/api/data', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                counter: this.counter,
                                timestamp: new Date().toISOString()
                            })
                        });
                        const data = await response.json();
                        this.message = data.message;
                    } catch (error) {
                        this.message = 'Error sending data: ' + error.message;
                    }
                }
            }
        }
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}