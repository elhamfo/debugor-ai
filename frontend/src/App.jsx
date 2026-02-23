import { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [initialIssue, setInitialIssue] = useState('');
  const [llmProvider, setLlmProvider] = useState('ollama');
  const [model, setModel] = useState('gpt-4o');
  const [conversation, setConversation] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const sendToAI = async (message, isFollowUp = false) => {
    if (!message.trim()) return;

    setLoading(true);

    const newEntry = { role: 'user', content: message };
    const updatedConversation = isFollowUp
      ? [...conversation, newEntry]
      : [newEntry];

    setConversation(updatedConversation);
    setCurrentMessage('');

    try {
      const payload = {
        code,
        language,
        issue_description: isFollowUp ? '' : message,
        llm_provider: llmProvider,
        model: llmProvider === 'openrouter' ? model : undefined,
        conversation_history: updatedConversation.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

      const res = await axios.post(`${API_URL}/debug`, payload, {
        timeout: 90000,
      });

      const aiReply = res.data.response;

      setConversation(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail
        || error.message
        || 'Failed to get response from AI';

      setConversation(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${errorMsg}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (e) => {
    e.preventDefault();
    if (!code.trim() || !initialIssue.trim()) return;
    sendToAI(initialIssue, false);
    setSessionEnded(false);
  };

  const handleSendFollowUp = (e) => {
    e.preventDefault();
    sendToAI(currentMessage, true);
  };

  const handleEndSession = () => {
    setConversation([]);
    setCode('');
    setInitialIssue('');
    setCurrentMessage('');
    setSessionEnded(true);
  };

  const detectSessionEnd = (message) => {
    const endPhrases = ['thanks', 'fixed', 'solved', 'got it', 'done', 'resolved'];
    return endPhrases.some(phrase => message.toLowerCase().includes(phrase));
  };

  // Check last user message for end signals
  const lastUserMessage = conversation[conversation.length - 1]?.role === 'user'
    ? conversation[conversation.length - 1].content
    : null;
  const suggestEnd = lastUserMessage && detectSessionEnd(lastUserMessage);

  return (
    <div className="min-h-screen bg-slate-700">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-md">
          AI Socratic Debugging Tutor
        </h1>
        <p className="text-center text-slate-200 mb-10">
          Get guided help to find and understand bugs — without direct solutions
        </p>

        {conversation.length === 0 && (
          <div className="bg-white/97 backdrop-blur-sm shadow-xl rounded-xl p-8 mb-10 border border-slate-600/30">
            <form onSubmit={handleStartSession} className="space-y-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 text-gray-800"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Code
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <Editor
                    height="340px"
                    language={language}
                    value={code}
                    onChange={setCode}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the problem you're seeing
                </label>
                <textarea
                  value={initialIssue}
                  onChange={e => setInitialIssue(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-5 py-4 text-gray-800 resize-y min-h-[140px] placeholder-gray-500"
                  placeholder="Example: I get “NameError: name 'x' is not defined” on line 8 when I try to run the script"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LLM Provider
                  </label>

                  {import.meta.env.VITE_IS_PRODUCTION === 'true' ? (
                    <div className="py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 font-medium">
                      Using <strong>OpenRouter (cloud)</strong> — recommended for live demo
                    </div>
                  ) : (
                    <select
                      value={llmProvider}
                      onChange={(e) => setLlmProvider(e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 text-gray-800"
                    >
                      <option value="ollama">Local (Ollama – dev only)</option>
                      <option value="openrouter">OpenRouter (cloud)</option>
                    </select>
                  )}
                </div>

                {/* Model input – only show in dev or when OpenRouter selected */}
                {(llmProvider === 'openrouter' || import.meta.env.VITE_IS_PRODUCTION !== 'true') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. gpt-4o, claude-3.5-sonnet..."
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 text-gray-800"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !code.trim() || !initialIssue.trim()}
                className="w-full bg-blue-500 text-white py-3.5 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md"
              >
                {loading ? 'Starting session...' : 'Start Socratic Debugging'}
              </button>
            </form>
          </div>
        )}

        {conversation.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Debugging Session</h2>
              <button
                onClick={handleEndSession}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all font-medium shadow-sm"
              >
                End Session
              </button>
            </div>

            <div className="space-y-6 mb-8 max-h-[65vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-blue-300">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl rounded-xl px-5 py-4 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-50 text-blue-950 border border-blue-100'
                        : 'bg-gray-50 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-2 opacity-75 tracking-wide">
                      {msg.role === 'user' ? 'YOU' : 'TUTOR'}
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {msg.content}
                    </pre>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-xl px-6 py-4 shadow-sm">
                    <div className="flex space-x-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {suggestEnd && !sessionEnded && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <p className="text-green-800 mb-3">Looks like you might have solved it! Ready to end this session?</p>
                <button
                  onClick={handleEndSession}
                  className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-all font-medium"
                >
                  Yes, I Got It!
                </button>
              </div>
            )}

            {!sessionEnded && (
              <form onSubmit={handleSendFollowUp} className="flex gap-4">
                <textarea
                  value={currentMessage}
                  onChange={e => setCurrentMessage(e.target.value)}
                  placeholder="Answer the tutor's questions or ask for clarification..."
                  rows={3}
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-5 py-4 resize-none text-gray-800 placeholder-gray-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !currentMessage.trim()}
                  className="bg-emerald-500 text-white px-7 py-3 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:opacity-50 transition-all font-medium shadow-md self-end"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
