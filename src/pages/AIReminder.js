import React, { useState, useEffect, useRef } from 'react';
import './AiReminder.css';

function AiReminder() {
  // Form state
  const [clientName, setClientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalDue, setTotalDue] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Audio and speech state
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const [conversationLog, setConversationLog] = useState([]);
  const [processing, setProcessing] = useState(false);
  const clientDataRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const currentTranscriptRef = useRef('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatusText('Listening...');
      currentTranscriptRef.current = '';
    };

    recognition.onerror = (event) => {
      setStatusText(`Error: ${event.error}`);
      if (event.error === 'not-allowed') stopListening();
    };

    recognition.onend = () => {
      setStatusText('Stopped');
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
        .then(stream => {
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
      setStatusText('Stopped.');
    }
  };

  const addMessage = (sender, message) => {
    setConversationLog(log => [...log, { sender, message, time: new Date().toLocaleTimeString() }]);
  };

  const processSpeech = async (transcript) => {
    if (processing) return;
    setProcessing(true);
    addMessage('user', transcript);
    currentTranscriptRef.current = '';

    try {
      // Placeholder for invoking backend API, fallback local response below
      const botReply = generateResponse(transcript.toLowerCase(), clientDataRef.current);
      addMessage('ai', botReply);
      speakText(botReply);
    } catch {
      const fallback = "Sorry, couldn't understand. Please repeat.";
      addMessage('ai', fallback);
      speakText(fallback);
    } finally {
      setProcessing(false);
    }
  };

  const generateResponse = (input, clientData) => {
    if (!clientData) return "Please submit client information first.";
    if (input.includes('paid') || input.includes('payment')) {
      return `Thank you for confirming your payment, ${clientData.name}.`;
    }
    if (input.includes('balance') || input.includes('due')) {
      return `Your total due amount is ₹${clientData.totalDue}.`;
    }
    if (input.includes('emi')) {
      return `Your EMI amount is ₹${clientData.emiAmount}.`;
    }
    if (input.includes('bye')) {
      return `Thank you, ${clientData.name}. Have a good day!`;
    }
    return `Hello, ${clientData.name}. Please ask any questions about your loan or payments.`;
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

    const greet = generateGreeting(data);
    addMessage('ai', greet);
    speakText(greet);
  };

  const generateGreeting = (data) => {
    if (!data) return "Hello! Please enter client details.";
    const daysLeft = Math.ceil((new Date(data.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft >= 0) {
      return `Hello ${data.name}, your EMI of ₹${data.emiAmount} is due in ${daysLeft} days on ${new Date(data.dueDate).toLocaleDateString()}. Your total due is ₹${data.totalDue}. How can I assist you?`;
    } else {
      return `Hello ${data.name}, your EMI of ₹${data.emiAmount} was due ${-daysLeft} days ago. Your total due is ₹${data.totalDue}. How can I assist you?`;
    }
  };

  return (
    <div className="container">
      <form className="client-form" onSubmit={handleSubmit}>
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

        <button className="btn-primary" type="submit">Start AI Call</button>
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
