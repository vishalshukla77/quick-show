import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import { toast } from 'react-hot-toast';

function SeatLayout() {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];

  const getShow = async () => {
    const foundShow = dummyShowsData.find(show => show._id === id);
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData
      });
    }
  };

const handleSeatClick = (seatId) => {
  if (!selectedTime) {
    toast.error("Please select time first");
    return;
  }

  const alreadySelected = selectedSeats.includes(seatId);

  if (!alreadySelected && selectedSeats.length >= 5) {
    toast.error("You can only select 5 seats");
    return;
  }

  setSelectedSeats(prev =>
    alreadySelected
      ? prev.filter(seat => seat !== seatId)
      : [...prev, seatId]
  );
};



const renderSeats = (row, count = 9) => {
  return (
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-10 w-10 rounded-md border text-sm font-medium
                ${isSelected 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-black text-primary/60 border-primary/60 hover:bg-pink-900/10 transition'}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );
};


  useEffect(() => {
    getShow();
  }, []);

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-12'>
      {/* Sidebar: Available Timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-24'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div>
          {show.dateTime[date]?.length > 0 ? (
            show.dateTime[date].map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition 
                  ${selectedTime?.time === item.time ? 'bg-primary text-white' : 'hover:bg-primary/20 text-gray-300'}`}
              >
                <ClockIcon className='w-4 h-4' />
                <p className='text-sm'>{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <p className='px-6 text-sm text-gray-400'>No timings available</p>
          )}
        </div>
      </div>

      {/* Seat Layout Area */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" left="0" />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='mt-10 text-xs text-gray-300 flex flex-col items-center'>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map(row => renderSeats(row))
            }
          </div>
        </div>
       <div className='grid grid-cols-2 gap-11'>
  {groupRows.slice(1).map((group, idx) => (
    <div key={idx} className='flex flex-col gap-2'>
      {group.map(row => renderSeats(row))}
    </div>
  ))}
</div>

      
      <button onClick={()=>navigate('/my-booking')} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
Proceed to Checkout
<ArrowRightIcon strokeWidth={3} className='w-4 h-4'/>
      </button>
      </div>
      </div>
      
    
  ) : (
    <Loading />
  );
}

export default SeatLayout;
