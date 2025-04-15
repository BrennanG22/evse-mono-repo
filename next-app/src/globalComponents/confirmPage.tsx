import React from 'react';

interface confirmPageProps{
  text:string,
  onConfirm: () => void,
  onCancel: () => void
}

const ConfirmPage: React.FC<confirmPageProps> = ({text, onConfirm, onCancel}) => {
  return (
    <div className="fixed inset-0 top-[4rem] z-40 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-semibold text-yellow-700 mb-4">⚠️ Warning</h2>
        <p className="text-gray-800 mb-6">{text}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;
