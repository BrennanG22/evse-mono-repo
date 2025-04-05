import DownloadButton from "./downloadButton";

interface FileEntryProps {
  name: string
}

const FileEntry: React.FC<FileEntryProps> = ({ name }) => {

  return (
    <div className="bg-slate-100 rounded-lg shadow-lg p-4 flex items-center justify-between">
      <span className="text-xl font-semibold text-gray-800">{name}</span>
      <DownloadButton fileName={name} />
    </div>
  );
};

export default FileEntry;