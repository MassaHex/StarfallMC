document.addEventListener('DOMContentLoaded', function() {
    fetchServerStatus();
});

function fetchServerStatus() {
    fetch('https://api.mcstatus.io/v2/status/bedrock/172.190.176.137:30038')
        .then(response => response.json())
        .then(data => {
            const serverStatusElement = document.getElementById('serverStatus');
            serverStatusElement.innerHTML = '';

            if (data.online) {
                const status = data.players.online + '/' + data.players.max;
                const serverName = '☢️AtomicSMP☢️';

                serverStatusElement.innerHTML = `<div class="serverStatus-inner">
                                                    <div class="serverStatus-circle">
                                                        <span>${status}</span>
                                                    </div>
                                                    <div class="serverStatus-text">
                                                        <p class="online">Server is online</p>
                                                        <p>Server Name: ${serverName}</p>
                                                    </div>
                                                </div>`;
            } else {
                serverStatusElement.innerHTML = `<div class="serverStatus-inner">
                                                    <div class="serverStatus-circle">
                                                        <span>Offline</span>
                                                    </div>
                                                    <div class="serverStatus-text">
                                                        <p class="offline">Server is currently offline</p>
                                                    </div>
                                                </div>`;
            }
        })
        .catch(error => {
            const serverStatusElement = document.getElementById('serverStatus');
            serverStatusElement.innerHTML = `<p>Error fetching server status.</p>`;
            console.error(error);
        });
}
