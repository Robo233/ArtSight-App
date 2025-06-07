import ButtonWithLabel from "../buttons/ButtonWithLabel";
import Input from "./Input";
import Section from "./Section";

interface ListSectionProps {
  title: string;
  items: string[] | undefined;
  onItemsChange: (updatedItems: string[]) => void;
}

const ListSection: React.FC<ListSectionProps> = ({
  title,
  items,
  onItemsChange,
}) => {
  const handleUpdateItem = (value: string, index: number) => {
    const updatedItems = items!.map((item, idx) =>
      idx === index ? value : item
    );
    onItemsChange(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items!.filter((_, idx) => idx !== index);
    onItemsChange(updatedItems);
  };

  const handleAddItem = () => {
    const updatedItems = [...items!, ""];
    onItemsChange(updatedItems);
  };

  return (
    <Section title={`${title}s`}>
      {items!.map((item, index) => (
        <div key={index} className="w-full ">
          <div className="flex flex-col items-center">
            <Input
              type="text"
              value={item}
              onChange={(e) => handleUpdateItem(e.target.value, index)}
              label=""
            />
            <div className=" mt-3">
              <ButtonWithLabel
                type="button"
                onClick={() => handleRemoveItem(index)}
                label="Remove"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <ButtonWithLabel
          type="button"
          onClick={handleAddItem}
          label={`Add ${title}`}
        />
      </div>
    </Section>
  );
};

export default ListSection;
