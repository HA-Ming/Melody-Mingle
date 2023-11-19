$(document).ready(function () {
    const clientId = '864d3d4eff15490da44bce6db933b253';
    const redirectUri = 'http://localhost:3000';
    const scopes = ['user-read-private', 'user-read-email'];

    let accessToken = '';

    // Check if the user is already authenticated
    const params = new URLSearchParams(window.location.search);
    if (params.has('access_token')) {
        accessToken = params.get('access_token');
        showUserProfile();
    } else {
        $('#login-btn').click(function () {
            authenticateSpotify();
        });
    }

    function authenticateSpotify() {
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
    }

    function showUserProfile() {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            success: function (data) {
                $('#login').hide();
                $('#user-profile').show();
                $('#user-name').text(data.display_name);
                $('#logout-btn').click(function () {
                    accessToken = '';
                    $('#user-profile').hide();
                    $('#login').show();
                });
                getTopTracks();
            }
        });
    }

    function getTopTracks() {
        $.ajax({
            url: 'https://api.spotify.com/v1/me/top/artists',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            success: function (data) {
                const artists = data.items.map(item => item.name);
                findMatchedUsers(artists);
            }
        });
    }

    function findMatchedUsers(userArtists) {
        // You would implement logic here to find matched users based on their music taste
        // For simplicity, let's assume there are predefined users with their music taste
        const matchedUsers = [
            { name: 'User1', artists: ['Artist1', 'Artist2', 'Artist3'] },
            { name: 'User2', artists: ['Artist2', 'Artist3', 'Artist4'] },
            // Add more users as needed
        ];

        displayMatchedUsers(matchedUsers, userArtists);
    }

    function displayMatchedUsers(matchedUsers, userArtists) {
        $('#match-results').show();
        const $matchedUsersList = $('#matched-users');
        $matchedUsersList.empty();

        matchedUsers.forEach(user => {
            const commonArtists = user.artists.filter(artist => userArtists.includes(artist));
            if (commonArtists.length > 0) {
                const $li = $('<li>').text(`${user.name}: ${commonArtists.join(', ')}`);
                $matchedUsersList.append($li);
            }
        });
    }
});
