import React, { useState, useEffect, useRef } from 'react';
import './AiReminder.css'; // See styles below

function AiReminder() {
  // Form state
  const [clientName, setClientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalDue, setTotalDue] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Speech-related state
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const [conversationLog, setConversationLog] = useState([]);
  const [processing, setProcessing] = useState(false);
  const speechTimeoutRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const clientDataRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition unsupported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Set locale

    recognition.onstart = () => {
      setStatusText('Listening...');
      currentTranscriptRef.current = '';
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setStatusText('Microphone access denied.');
        stopListening();
      } else {
        setStatusText(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setStatusText('Stopped speaking');
      setIsListening(false);
      if (!processing && clientDataRef.current) setTimeout(() => startListening(), 500);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        currentTranscriptRef.current += finalTranscript;
        if (!processing) processSpeech(currentTranscriptRef.current.trim());
      } else if (interimTranscript) {
        setStatusText(`Listening... "${interimTranscript}"`);
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = setTimeout(() => {
          if (currentTranscriptRef.current.trim() && !processing) {
            processSpeech(currentTranscriptRef.current.trim());
          }
        }, 3000);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      clearTimeout(speechTimeoutRef.current);
    };
  }, [processing]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach(track => track.stop());
          recognitionRef.current.start();
          setIsListening(true);
          setStatusText('Listening...');
        })
        .catch(() => setStatusText('Microphone permission denied.'));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusText('Stopped');
    }
  };

  const addMessage = (sender, message) => {
    setConversationLog(log => [...log, { sender, message, time: new Date().toLocaleTimeString() }]);
  };

  const processSpeech = async (input) => {
    if (processing) return;
    setProcessing(true);
    addMessage('user', input);
    currentTranscriptRef.current = '';

    try {
      // For testing, respond locally
      const response = generateResponse(input.toLowerCase());
      addMessage('ai', response);
      speakText(response);
    } catch {
      addMessage('ai', 'Sorry, I did not catch that.');
      speakText('Sorry, I did not catch that.');
    } finally {
      setProcessing(false);
    }
  };

  const generateResponse = (input) => {
    const data = clientDataRef.current;
    if (!data) return 'Please submit client details first.';
    if (input.includes('paid') || input.includes('payment')) {
      return `Thanks for the payment update, ${data.name}.`;
    }
    if (input.includes('balance') || input.includes('due amount')) {
      return `Your outstanding amount is ₹${data.totalDue}.`;
    }
    if (input.includes('emi')) {
      return `Your EMI amount is ₹${data.emiAmount}.`;
    }
    if (input.includes('bye') || input.includes('thank you')) {
      return `Thank you, ${data.name}. Have a nice day!`;
    }
    return `Hello ${data.name}, how can I assist you with your EMI today?`;
  };

  const speakText = (text) => {
    setStatusText('Speaking...');
    stopListening();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;

    utterance.onend = () => {
      setStatusText('Listening...');
      startListening();
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name: clientName, mobile: mobileNumber, totalDue, emiAmount, dueDate };
    clientDataRef.current = data;
    addMessage('system', `Client data saved for ${clientName}`);

    const greeting = generateGreeting(data);
    addMessage('ai', greeting);
    speakText(greeting);
  };

  const generateGreeting = (data) => {
    const days = Math.ceil((new Date(data.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days >= 0) {
      return `Hi ${data.name}, your EMI of ₹${data.emiAmount} is due in ${days} days on ${new Date(data.dueDate).toLocaleDateString()}. Outstanding amount is ₹${data.totalDue}.`;
    } else {
      return `Hi ${data.name}, your EMI of ₹${data.emiAmount} was due ${-days} days ago. Outstanding amount is ₹${data.totalDue}.`;
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="client-form">
        <h1>Client Information</h1>
        <p>Enter client details for EMI reminder call</p>

        <label>Client Name:</label>
        <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required />

        <label>Mobile Number:</label>
        <input type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} required />

        <label>Total Due Amount (₹):</label>
        <input type="number" value={totalDue} onChange={e => setTotalDue(e.target.value)} required />

        <label>EMI Amount (₹):</label>
        <input type="number" value={emiAmount} onChange={e => setEmiAmount(e.target.value)} required />

        <label>Due Date:</label>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />

        <button type="submit" className="btn-primary">Start AI Call</button>
      </form>

      <div className="audio-interface">
        <div className="audio-controls">
          <button onClick={startListening} disabled={isListening}>Start Listening</button>
          <button onClick={stopListening} disabled={!isListening}>Stop Listening</button>
        </div>
        <div className="status-indicator">
          <span>{statusText}</span>
        </div>
        <div className="conversation-log">
          {conversationLog.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              <div>{msg.message}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AiReminder;
