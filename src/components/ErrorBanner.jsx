function ErrorBanner({ message, onClose }) {
  return (
    <div className="max-w-3xl mx-auto mb-8 animate-fadeIn">
      <div className="glass-strong rounded-2xl p-5 shadow-2xl border-l-4 border-red-500">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              ⚠️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1 drop-shadow">Oops!</h3>
              <p className="text-white/90 leading-relaxed">{message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-all"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBanner;
