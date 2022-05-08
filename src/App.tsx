import {} from './pages/AvatarUpload';
import './styles/global.scss';

import { CropImageProvider } from './context/CropImageContext';

import { AvatarUpload } from './pages/AvatarUpload';

const App:React.FC = () => {
  return (
    <CropImageProvider>
      <AvatarUpload />
    </CropImageProvider>
  );
}

export default App;
