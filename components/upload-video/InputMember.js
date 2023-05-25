import { useEffect, useState } from 'react';
import ErrorMessage from '../error/ErrorMessage';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const InputMember = ({ setMember, value1, value2, onClose, index }) => {
  const [name, setName] = useState(value1 ?? '');
  const [email, setEmail] = useState(value2 ?? '');
  const [error, setError] = useState({
    name: '',
    email: ''
  });

  const onChangeName = (e) => {
    setName(e.target.value);
    setMember();
  };

  const onChangeEmail = (e) => {
    const re = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (!re.test(e.target.value)) {
      setError({
        ...error,
        email: 'Email is not valid'
      });
    } else {
      setError({
        ...error,
        email: ''
      });
    }
    setEmail(e.target.value);
    setMember();
  };

  useEffect(() => {
    if (name === '' || email === '') {
      setError({
        ...error,
        name: '',
        email: ''
      });
    }

    if (name === '' && email !== '') {
      setError({
        ...error,
        name: 'Name is required'
      });
    }

    if (name !== '' && email === '') {
      setError({
        ...error,
        email: 'Email is required'
      });
    }
    setMember();
  }, [name, email]);

  return (
    <div className="grid grid-cols-2 gap-1 md:gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm">Name</label>
        <input
          name="member_name"
          className="text-sm bg-[#D9D9D9] px-4 py-3 text-[#0000FF] rounded-md w-90 mb-2"
          type="text"
          placeholder="Name"
          value={name}
          onChange={onChangeName}
        />
        <ErrorMessage message={error.name} />
      </div>
      <div className="flex flex-col gap-2">
      <label className="text-sm">Email</label>
        <div className="flex items-center content-between mb-3">
          <input
            name="member_email"
            className="text-sm bg-[#D9D9D9] px-4 py-3 text-[#0000FF] rounded-md w-100 flex-auto "
            type="email"
            placeholder="Email"
            value={email}
            onChange={onChangeEmail}
          />
          <AiOutlineCloseCircle
            size={30}
            style={{ marginLeft: 5 }}
            className="text-[#FF00FE]"
            onClick={() => onClose(index)}
          />
        </div>
        <ErrorMessage message={error.email} />
      </div>
    </div>
  );
};

export default InputMember;
