import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../buttons/Button";

interface ImageWithTrashProps {
  imageURL: string | undefined;
  deleteImage?: () => void;
}

const ImageWithTrash: React.FC<ImageWithTrashProps> = ({
  imageURL,
  deleteImage,
}) => {
  return (
    <div className="relative w-24 h-24">
      <img
        src={imageURL}
        alt={`Artwork image`}
        className="w-full h-full object-cover"
        draggable="false"
      />
      {deleteImage && (
        <Button
          type="button"
          onClick={deleteImage}
          className="absolute top-0 right-0 bg-white p-1 rounded-full text-primary"
          activeClassName="text-primary-hover"
        >
          <FontAwesomeIcon icon={faTrashAlt} className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default ImageWithTrash;
