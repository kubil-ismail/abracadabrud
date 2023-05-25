import { useState, Fragment, useCallback, useEffect } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import { Dialog, Transition } from '@headlessui/react';
import { getImageSize } from 'react-image-size';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImages';

function ModalCrop({ show, onHide, configCrop, imagesCrop, resultCrop }) {
  // const {
  //   show, onHide, configCrop, imagesCrop, resultCrop,
  // } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // eslint-disable-next-line no-unused-vars
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [objectFit, setoOjectFit] = useState('contain');
  // objectFit = 'contain',

  const onCropComplete = useCallback((croppedArea, newCroppedAreaPixels) => {
    setCroppedAreaPixels(newCroppedAreaPixels);
  }, []);

  const onCrop = useCallback(async () => {
    try {
      const result = await getCroppedImg(imagesCrop, croppedAreaPixels, rotation);
      resultCrop(result);
      setCroppedImage(croppedImage);
      onHide();
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const checkImagesSize = async () => {
    // objectFit?: 'contain' | 'horizontal-cover' | 'vertical-cover' | 'auto-cover';
    const { width, height } = await getImageSize(imagesCrop);
    if (height > width && width < configCrop?.width) {
      setoOjectFit('horizontal-cover');
    } else if (height < configCrop?.height) {
      setoOjectFit('vertical-cover');
    }
  };
  useEffect(() => {
    if (imagesCrop) {
      checkImagesSize();
    }
  }, [imagesCrop]);

  // const onClose = useCallback(() => {
  //   setCroppedImage(null);
  // }, []);
  const style = {
    primary_background: '#FF00FE',
    secondary_background: '#0001FF',
    accent_background: '#10FF00',
    background_section: '#1B283B',
    background_card: '#23344F ',
    background_popup: '#29164F ',
    btn_color: '#FF00FE',
    input_color: '#00F8EF',
    light_text: '#ffff',
    dark_text: '#002E3A'
  };

  return (
    <div>
      <Transition appear show={show} onClick={onHide} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={onHide}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-gradient-to-b from-[#7C10FA] to-[#FF00FE] text-center align-middle shadow-xl transition-all">
                  <div
                    className="bg-cover p-4"
                    // style={{ background: 'url(/assets/images/asset-modal.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
                    style={{
                      background: 'url(/assets/images/graphic-popup.png)',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover'
                    }}
                  >
                    <div className="mb-4 cursor-pointer">
                      <IoIosCloseCircle size={40} className="text-white ml-auto" onClick={onHide} />
                    </div>
                    <div className="flex flex-col  items-center justify-center">
                      <div className="box-content h-64 w-full border-4 relative ">
                        <Cropper
                          showGrid={false}
                          image={imagesCrop}
                          crop={crop}
                          zoom={zoom}
                          aspect={configCrop?.cropShape === 'round' ? 1 : 4 / 3}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          cropShape={configCrop.cropShape}
                          restrictPosition
                          minZoom={1}
                        />
                      </div>
                      <div className="mt-6 flex items-center justify-center gap-2 my-3">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md px-4 py-2 text-xs md:text-sm font-normal border-2 border-[#0001FF] text-[#0001FF]"
                          onClick={() => onHide()}
                        >
                          I will do it later
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md bg-second-accent px-4 py-2 text-sm font-medium text-third-accent hover:bg-third-accent hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => onCrop()}
                          style={{
                            background: style?.accent_background,
                            color: style?.secondary_background
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
// ModalCrop.defaultProps = {
//   configCrop: {
//     cropShape: 'round',
//     height: 150,
//     width: 150,
//   },
// };

export default ModalCrop;
