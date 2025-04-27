// DebateLive - Voting Client Integration
// Add this to your livedebates.js file

// DOM Elements (adjust these selectors to match your HTML structure)
const votingContainer = document.getElementById('voting-container');
const voteQuestion = document.getElementById('vote-question');
const voteOptions = document.getElementById('vote-options');
const voteResults = document.getElementById('vote-results');
const voteTimer = document.getElementById('vote-timer');

// Current vote data
let currentVote = null;
let voteTimerInterval = null;

// Assume socket and isConnected are defined elsewhere, e.g., in livedebates.js
// For demonstration purposes, let's define them here:
let socket;
let isConnected = false;

// Fetch active votes
async function fetchActiveVotes() {
  try {
    const response = await fetch('/api/votes');
    const data = await response.json();
    
    if (data.count > 0) {
      // Use the first active vote
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
    console.error('Error fetching active votes:', error);
    hideVotingContainer();
  }
}

// Display vote in the UI
function displayVote(vote) {
  currentVote = vote;
  
  // Update question
  voteQuestion.textContent = vote.question;
  
  // Clear previous options
  voteOptions.innerHTML = '';
  
  // Add options
  vote.options.forEach(option => {
    const optionButton = document.createElement('button');
    optionButton.className = 'vote-option';
    optionButton.dataset.optionId = option.id;
    optionButton.textContent = option.text;
    optionButton.addEventListener('click', () => submitVote(option.id));
    
    voteOptions.appendChild(optionButton);
  });
  
  // Show voting container
  votingContainer.classList.remove('hidden');
  
  // Start timer
  startVoteTimer(vote);
}

// Hide voting container
function hideVotingContainer() {
  votingContainer.classList.add('hidden');
  currentVote = null;
  
  // Clear timer
  if (voteTimerInterval) {
    clearInterval(voteTimerInterval);
    voteTimerInterval = null;
  }
}

// Start vote timer
function startVoteTimer(vote) {
  // Clear any existing timer
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
      
      // Disable option buttons
      const optionButtons = voteOptions.querySelectorAll('.vote-option');
      optionButtons.forEach(button => {
        button.disabled = true;
      });
      
      // Show results
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
    // Get user ID (in a real app, this would come from your auth system)
    const userId = localStorage.getItem('userId') || `user-${Date.now()}`;
    
    // Store user ID for future use
    localStorage.setItem('userId', userId);
    
    const response = await fetch(`/api/votes/${currentVote.id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        optionId,
        userId
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // Disable option buttons
      const optionButtons = voteOptions.querySelectorAll('.vote-option');
      optionButtons.forEach(button => {
        button.disabled = true;
      });
      
      // Show a message
      const message = document.createElement('div');
      message.className = 'vote-message';
      message.textContent = 'Your vote has been recorded!';
      voteOptions.appendChild(message);
      
      // Update vote data
      currentVote = data.voteData;
      
      // Show results
      displayVoteResults(currentVote);
    } else {
      alert(data.error || 'Failed to submit vote');
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    alert('Failed to submit vote. Please try again.');
  }
}

// Display vote results
function displayVoteResults(vote) {
  // Clear previous results
  voteResults.innerHTML = '';
  
  // Create results heading
  const heading = document.createElement('h3');
  heading.textContent = 'Current Results';
  voteResults.appendChild(heading);
  
  // Calculate percentages
  const totalVotes = vote.totalVotes;
  
  // Create result bars
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
  
  // Show results container
  voteResults.classList.remove('hidden');
}

// Handle vote updates from WebSocket
function handleVoteUpdate(data) {
  if (data.type === 'vote_started') {
    // If we don't have a vote yet, display this one
    if (!currentVote) {
      displayVote(data.data);
    }
  } else if (data.type === 'vote_updated') {
    // Update our current vote if it matches
    if (currentVote && currentVote.id === data.data.id) {
      currentVote = data.data;
      displayVoteResults(currentVote);
    }
  } else if (data.type === 'vote_completed') {
    // If this is our current vote, update it
    if (currentVote && currentVote.id === data.data.id) {
      currentVote = data.data;
      
      // Update UI to show vote is completed
      voteTimer.textContent = 'Vote ended';
      
      // Disable option buttons
      const optionButtons = voteOptions.querySelectorAll('.vote-option');
      optionButtons.forEach(button => {
        button.disabled = true;
      });
      
      // Show final results
      displayVoteResults(currentVote);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Fetch active votes
  fetchActiveVotes();
  
  // Subscribe to vote updates via WebSocket
  if (socket && isConnected) {
    socket.send(JSON.stringify({
      type: 'subscribe',
      topics: ['debate-votes']
    }));
  }
});