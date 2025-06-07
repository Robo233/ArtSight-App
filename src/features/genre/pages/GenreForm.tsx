import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Genre, ImageDescription } from "../../../shared/types/types-dashboard";
import EntityForm from "../../../shared/components/EntityForm";
import ImageDescriptionsSection from "../../../shared/components/ImageDescriptionsSection";
import { fetchEntity } from "../../../shared/services/entityServiceDashboard";

const GenreForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [genre, setGenre] = useState<Genre>({
    id: "",
    name: {},
    description: {},
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<
    ImageDescription[]
  >([]);

  const [notFound, setNotFound] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEntity("genre", id, setGenre, setNotFound, setServerError);
    }
  }, [id]);

  useEffect(() => {
    if (genre) {
      setImageDescriptions(genre.imageDescriptions || []);
    }
  }, [genre]);

  const addCustomFormData = (formData: FormData) => {
    imageFiles.forEach((file, index) => {
      formData.append(`ImageDescriptions[${index}].Image`, file);
    });
    imageDescriptions.forEach((descObj, index) => {
      Object.entries(descObj).forEach(([lang, desc]) => {
        formData.append(
          `ImageDescriptions[${index}].Descriptions[${lang}]`,
          desc || ""
        );
      });
    });
  };

  const handleSuccess = () => {
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 100);
  };

  return (
    <EntityForm
      entityType="genre"
      entity={genre}
      setEntity={setGenre}
      entityId={id}
      transformFormData={addCustomFormData}
      onSuccess={handleSuccess}
      notFound={notFound}
      serverError={serverError}
    >
      <ImageDescriptionsSection
        imageDescriptions={imageDescriptions}
        onChangeImageDescriptions={setImageDescriptions}
        imageFiles={imageFiles}
        onChangeImageFiles={setImageFiles}
        entityType="genre"
        id={id}
        submissionSuccess={submissionSuccess}
      />
    </EntityForm>
  );
};

export default GenreForm;
