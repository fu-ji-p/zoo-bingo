interface RubyProps {
  text: string;
  reading: string;
}

export const Ruby: React.FC<RubyProps> = ({ text, reading }) => (
  <ruby>
    {text}
    <rt style={{ fontSize: '0.6em', color: '#888' }}>{reading}</rt>
  </ruby>
);
