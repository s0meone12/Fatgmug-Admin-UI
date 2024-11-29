import React, { useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/shadcn/button';
import { Label } from '@/components/ui/shadcn/label';
import { Input } from '@/components/ui/shadcn/input';
import { Textarea } from '@/components/ui/shadcn/textarea';

interface Column {
  id: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, unknown>) => void;
  data: Record<string, unknown>;
  columns: Column[];
}

export function EditModal({ isOpen, onClose, onSave, data, columns }: EditModalProps) {
  const [values, setValues] = React.useState(data);

  // Update `values` whenever `data` changes
  useEffect(() => {
    setValues(data);
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'number' && e.target instanceof HTMLInputElement && e.target.step === '0.1' 
        ? parseFloat(value)
        : type === 'number'
        ? parseInt(value, 10)
        : value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {
      setValues(data); // Reset values on close
      onClose();
    }} title="Edit Product">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {columns
            .filter(column => column.id !== 'select')
            .map(column => (
              <div key={column.id}>
                <Label className="text-sm font-medium text-gray-700">
                  {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                </Label>
                {column.id === 'description' ? (
                  <Textarea
                    name={column.id}
                    value={(values[column.id] as string) || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 w-full"
                  />
                ) : (
                  <Input
                    type={typeof values[column.id] === 'number' ? 'number' : 'text'}
                    name={column.id}
                    value={(values[column.id] as string | number) || ''}
                    onChange={handleInputChange}
                    step={column.id === 'rating' ? '0.1' : undefined}
                    min={column.id === 'rating' ? '0' : undefined}
                    max={column.id === 'rating' ? '5' : undefined}
                    className="mt-1 w-full"
                    readOnly={column.id === 'id'}
                  />
                )}
              </div>
            ))}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="outline" onClick={() => {
            setValues(data); // Reset values if cancelled
            onClose();
          }}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}



// import React, { useEffect } from 'react';
// import { Modal } from './Modal';
// import { Button } from '@/components/ui/shadcn/button';
// import { Label } from '@/components/ui/shadcn/label';
// import { Input } from '@/components/ui/shadcn/input';
// import { Textarea } from '@/components/ui/shadcn/textarea';

// interface Column {
//   id: string;
// }

// interface EditModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (values: Record<string, unknown>) => void;
//   data: Record<string, unknown>;
//   columns: Column[];
//   isAddingNewRow?: boolean;
// }

// export function EditModal({ isOpen, onClose, onSave, data, columns, isAddingNewRow = false }: EditModalProps) {
//   const [values, setValues] = React.useState(isAddingNewRow ? {} : data);

//   // Update `values` whenever `data` changes
//   useEffect(() => {
//     setValues(isAddingNewRow ? {} : data);  // Start with empty values if adding new row
//   }, [data, isAddingNewRow]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(values);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     setValues(prev => ({
//       ...prev,
//       [name]: type === 'number' && e.target instanceof HTMLInputElement && e.target.step === '0.1' 
//         ? parseFloat(value)
//         : type === 'number'
//         ? parseInt(value, 10)
//         : value
//     }));
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={() => {
//       setValues(isAddingNewRow ? {} : data); // Reset values to initial state on close
//       onClose();
//     }} title={isAddingNewRow ? "Add New Product" : "Edit Product"}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           {columns
//             .filter(column => column.id !== 'select')
//             .map(column => (
//               <div key={column.id}>
//                 <Label className="text-sm font-medium text-gray-700">
//                   {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
//                 </Label>
//                 {column.id === 'description' ? (
//                   <Textarea
//                     name={column.id}
//                     value={(values[column.id] as string) || ''}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="mt-1 w-full"
//                   />
//                 ) : (
//                   <Input
//                     type={typeof values[column.id] === 'number' ? 'number' : 'text'}
//                     name={column.id}
//                     value={(values[column.id] as string | number) || ''}
//                     onChange={handleInputChange}
//                     step={column.id === 'rating' ? '0.1' : undefined}
//                     min={column.id === 'rating' ? '0' : undefined}
//                     max={column.id === 'rating' ? '5' : undefined}
//                     className="mt-1 w-full"
//                     readOnly={column.id === 'id' && !isAddingNewRow}  // Allow ID editing for new rows if needed
//                   />
//                 )}
//               </div>
//             ))}
//         </div>
//         <div className="flex justify-end space-x-3 mt-6">
//           <Button type="button" variant="outline" onClick={() => {
//             setValues(isAddingNewRow ? {} : data); // Reset values if cancelled
//             onClose();
//           }}>
//             Cancel
//           </Button>
//           <Button type="submit">
//             {isAddingNewRow ? "Add" : "Save Changes"}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// }
