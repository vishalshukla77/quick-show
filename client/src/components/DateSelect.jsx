import React, { useState } from 'react';
import BlurCircle from './BlurCircle';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function DateSelect({ dateTime, id }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const onBookHandler = () => {
    if (!selectedDate) {
      return toast('Please select a date');
    }
    navigate(`/movies/${id}/${selectedDate}`);
    window.scrollTo(0, 0);
  };

  return (
    <div id="dateSelect" className='pt-30'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <div>
          <p className='text-lg font-semibold'>Choose Date</p>
          <div className='flex items-center gap-6 text-sm mt-5'>
            <ChevronLeftIcon width={28} className='cursor-pointer' />

            <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
              {Object.keys(dateTime).map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  aria-pressed={selectedDate === date}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer transition duration-150 ${
                    selectedDate === date
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <span>{new Date(date).getDate()}</span>
                  <span>{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </span>

            <ChevronRightIcon width={28} className='cursor-pointer' />
          </div>
        </div>

        <button
          onClick={onBookHandler}
          className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default DateSelect;
