const AudioMessage = ({ audioUrl }) => {
  return <audio controls src={audioUrl} />;
};

export default AudioMessage;
