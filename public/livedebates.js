document.addEventListener("DOMContentLoaded", () => {
  // --- Handle UI interactions ---

  // Play button for videos
  const playButton = document.querySelector(".play-button");
  const videoContainerUI = document.querySelector(".video-container");
  if (playButton && videoContainerUI) {
    playButton.addEventListener("click", () => {
      alert("This is where a real video player would kick in.");
    });
  }

  // Reminder buttons ("Set Reminder" functionality)
  const reminderButtons = document.querySelectorAll(".btn-primary.btn-sm");
  reminderButtons.forEach((button) => {
    if (button.textContent.includes("Set Reminder")) {
      button.addEventListener("click", function () {
        this.innerHTML = '<i class="fas fa-check"></i> Reminder Set';
        this.classList.add("reminder-set");
        alert("Reminder set! We'll let you know when the debate starts.");
      });
    }
  });

  // Simple chat functionality
  const chatInput = document.querySelector(".chat-input input");
  const chatSendButton = document.querySelector(".chat-input .btn");
  const chatMessages = document.querySelector(".chat-messages");

  if (chatInput && chatSendButton && chatMessages) {
    chatSendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText) {
      const messageHTML = `
        <div class="message">
          <div class="message-avatar">
            <img src="https://via.placeholder.com/40x40" alt="You">
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-author">You</span>
              <span class="message-time">${getCurrentTime()}</span>
            </div>
            <div class="message-text">${messageText}</div>
          </div>
        </div>
      `;
      chatMessages.insertAdjacentHTML("beforeend", messageHTML);
      chatInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  }

  // Poll voting button
  const pollButton = document.querySelector(".live-poll .btn");
  if (pollButton) {
    pollButton.addEventListener("click", function () {
      alert("Thanks for your vote!");
      this.disabled = true;
      this.textContent = "Voted";
    });
  }

  // --- Live video and WebSocket stuff ---

  const videoContainer = document.getElementById('video-container');
  const videoElement = document.getElementById('debate-video');
  const videoTitle = document.getElementById('video-title');
  const videoDescription = document.getElementById('video-description');
  const viewerCount = document.getElementById('viewer-count');

  let currentStream = null;
  let socket;
  let isConnected = false;

  async function fetchActiveStream() {
    try {
      const response = await fetch('/api/streams/active');
      const data = await response.json();

      if (data.count > 0) {
        loadStream(data.streams[0]);
      } else {
        showNoActiveStream();
      }
    } catch (error) {
      console.error('Problem fetching active stream:', error);
      showNoActiveStream();
    }
  }

  function loadStream(stream) {
    currentStream = stream;
    videoTitle.textContent = stream.title;
    videoDescription.textContent = stream.description;
    viewerCount.textContent = `${stream.viewers} watching`;
    videoElement.src = stream.streamUrl;
    videoElement.load();
    videoContainer.classList.remove('hidden');

    registerViewer(stream.id, 'join');

    window.addEventListener('beforeunload', () => {
      registerViewer(stream.id, 'leave');
    });
  }

  function showNoActiveStream() {
    videoContainer.classList.add('hidden');
    videoTitle.textContent = 'No active debate';
    videoDescription.textContent = 'Check back later!';
    viewerCount.textContent = '';
  }

  async function registerViewer(streamId, action) {
    try {
      await fetch(`/api/streams/${streamId}/viewer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
    } catch (error) {
      console.error(`Viewer registration error (${action}):`, error);
    }
  }

  function handleStreamUpdate(data) {
    if (data.type === 'stream_started') {
      if (!currentStream) {
        loadStream(data.data);
      }
    } else if (data.type === 'stream_ended') {
      if (currentStream && currentStream.id === data.data.id) {
        showNoActiveStream();
        currentStream = null;
      }
    }
  }

  function initializeWebSocket() {
    socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('open', () => {
      console.log('WebSocket connected');
      isConnected = true;
      socket.send(JSON.stringify({
        type: 'subscribe',
        topics: ['debate-streams', 'debate-votes']
      }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      handleStreamUpdate(data);
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket disconnected, retrying...');
      isConnected = false;
      setTimeout(initializeWebSocket, 3000);
    });

    socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
    });
  }

  // Kick everything off
  fetchActiveStream();
  initializeWebSocket();
});

// --- Voting System ---

// Get all voting UI elements
const votingContainer = document.getElementById('voting-container');
const voteQuestion = document.getElementById('vote-question');
const voteOptions = document.getElementById('vote-options');
const voteResults = document.getElementById('vote-results');
const voteTimer = document.getElementById('vote-timer');

let currentVote = null;
let voteTimerInterval = null;

// Fetch current active votes
async function fetchActiveVotes() {
  try {
    const response = await fetch('/api/votes');
    const data = await response.json();

    if (data.count > 0) {
      const activeVotes = data.votes.filter(vote => vote.status === 'active');
      if (activeVotes.length > 0) {
        displayVote(activeVotes[0]);
      } else {
        hideVotingContainer();
      }
    } else {
      hideVotingContainer();
    }
  } catch (error) {
    console.error('Problem fetching votes:', error);
    hideVotingContainer();
  }
}

// Show voting options
function displayVote(vote) {
  currentVote = vote;

  voteQuestion.textContent = vote.question;
  voteOptions.innerHTML = '';

  vote.options.forEach(option => {
    const optionButton = document.createElement('button');
    optionButton.className = 'vote-option';
    optionButton.dataset.optionId = option.id;
    optionButton.textContent = option.text;
    optionButton.addEventListener('click', () => submitVote(option.id));

    voteOptions.appendChild(optionButton);
  });

  votingContainer.classList.remove('hidden');
  startVoteTimer(vote);
}

// Hide voting UI
function hideVotingContainer() {
  votingContainer.classList.add('hidden');
  currentVote = null;

  if (voteTimerInterval) {
    clearInterval(voteTimerInterval);
    voteTimerInterval = null;
  }
}

// Start the countdown timer for a vote
function startVoteTimer(vote) {
  if (voteTimerInterval) {
    clearInterval(voteTimerInterval);
  }

  const endTime = new Date(vote.endTime).getTime();

  voteTimerInterval = setInterval(() => {
    const now = Date.now();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      clearInterval(voteTimerInterval);
      voteTimer.textContent = 'Vote ended';

      const optionButtons = voteOptions.querySelectorAll('.vote-option');
      optionButtons.forEach(button => {
        button.disabled = true;
      });

      displayVoteResults(vote);
    } else {
      const seconds = Math.floor(timeLeft / 1000);
      voteTimer.textContent = `${seconds} seconds left`;
    }
  }, 1000);
}

// Submit a vote
async function submitVote(optionId) {
  if (!currentVote) return;

  try {
    const userId = localStorage.getItem('userId') || `user-${Date.now()}`;
    localStorage.setItem('userId', userId);

    const response = await fetch(`/api/votes/${currentVote.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId, userId })
    });

    const data = await response.json();

    if (data.status === 'success') {
      const optionButtons = voteOptions.querySelectorAll('.vote-option');
      optionButtons.forEach(button => {
        button.disabled = true;
      });

      const message = document.createElement('div');
      message.className = 'vote-message';
      message.textContent = 'Thanks! Your vote was counted.';
      voteOptions.appendChild(message);

      currentVote = data.voteData;
      displayVoteResults(currentVote);
    } else {
      alert(data.error || 'Could not submit vote.');
    }
  } catch (error) {
    console.error('Problem submitting vote:', error);
    alert('Failed to submit vote. Try again.');
  }
}

// Show voting results
function displayVoteResults(vote) {
  voteResults.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = 'Current Results';
  voteResults.appendChild(heading);

  const totalVotes = vote.totalVotes;

  vote.options.forEach(option => {
    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

    const resultItem = document.createElement('div');
    resultItem.className = 'vote-result-item';

    const label = document.createElement('div');
    label.className = 'vote-result-label';
    label.textContent = `${option.text}: ${option.votes} votes (${percentage}%)`;

    const barContainer = document.createElement('div');
    barContainer.className = 'vote-result-bar-container';

    const bar = document.createElement('div');
    bar.className = 'vote-result-bar';
    bar.style.width = `${percentage}%`;

    barContainer.appendChild(bar);
    resultItem.appendChild(label);
    resultItem.appendChild(barContainer);

    voteResults.appendChild(resultItem);
  });

  voteResults.classList.remove('hidden');
}

// Handle live vote updates
function handleVoteUpdate(data) {
  if (data.type === 'vote_started') {
    if (!currentVote) {
      displayVote(data.data);
    }
  } else if (data.type === 'vote_updated') {
    if (currentVote && currentVote.id === data.data.id) {
      currentVote = data.data;
      displayVoteResults(currentVote);
    }
  } else if (data.type === 'vote_completed') {
    if (currentVote && currentVote.id === data.data.id) {
      currentVote = data.data;
      voteTimer.textContent = 'Vote ended';

      const optionButtons = voteOptions.querySelectorAll('.vote-option');
      optionButtons.forEach(button => {
        button.disabled = true;
      });

      displayVoteResults(currentVote);
    }
  }
}

// Initialize vote system once page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchActiveVotes();

  if (socket && isConnected) {
    socket.send(JSON.stringify({
      type: 'subscribe',
      topics: ['debate-votes']
    }));
  }
});
