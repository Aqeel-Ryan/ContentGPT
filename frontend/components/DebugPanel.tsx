const DebugPanel = ({ data }: { data: any }) => {
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg opacity-75">
      <pre className="text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugPanel;