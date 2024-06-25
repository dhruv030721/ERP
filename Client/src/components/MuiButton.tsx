import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface MuiButtonProps {
  btnName: string;
  type: string;
  icon?: JSX.Element; // Marked as optional
  eventHandler: (event: any) => void;
  color: string,
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

function MuiButton({ btnName, type, icon, eventHandler, color, fileInputRef }: MuiButtonProps) {
  const handleClick = () => {
    if (type === 'file' && fileInputRef?.current) {
      fileInputRef.current.click();
    } else {
      eventHandler(new MouseEvent('click'));
    }
  };

  return (
    <div>
      <Button
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={icon}
        sx={{ backgroundColor: color, '&:hover': { backgroundColor: color } }}
        onClick={handleClick}
      >
        {btnName}
        {type === 'file' && <VisuallyHiddenInput ref={fileInputRef} type={type} onChange={eventHandler} />}
      </Button>
    </div>
  );
}

export default MuiButton;
