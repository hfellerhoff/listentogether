import { useEffect, useState } from 'react';
import Room from '../../models/Room';
import RoomSong from '../../models/RoomSong';
import Message from '../../models/Message';
import supabase from '../../util/supabase';

interface Dictionary<T> {
  [id: string]: T;
}

const useMessages = (roomID: number) => {
  const [dictionary, setDictionary] = useState<Dictionary<Message>>({});
  const [array, setArray] = useState<Message[]>([]);

  const table = 'messages';
  const whereColumn = 'room_id';

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  useEffect(() => {
    if (roomID < 0) return;

    // Fetch initial data
    const fetchData = async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(whereColumn, roomID);

      if (error) console.log('error', error);
      else {
        // Create dictionary out of array
        const updatedDictionary = data.reduce((dict, element) => {
          dict[element['id']] = element;
          return dict;
        }, {});

        setDictionary(updatedDictionary);
      }

      scrollToBottom();
    };

    fetchData();
  }, [roomID]);

  useEffect(() => {
    // Subscribe to future table changes
    const subscription = supabase
      .from(table)
      .on('*', (payload) => {
        console.log(`=== TABLE (${table}) ${payload.eventType} ===`);

        // Update data
        switch (payload.eventType) {
          case 'INSERT':
          case 'UPDATE':
            if (payload.new[whereColumn] !== roomID) return;

            setDictionary((d) => {
              return {
                ...d,
                [payload.new['id']]: payload.new,
              };
            });

            break;
          case 'DELETE':
            setDictionary((d) => {
              if (!d[payload.old.id]) return d;

              delete d[payload.old.id];
              return { ...d };
            });
            break;
        }

        scrollToBottom();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomID]);

  useEffect(() => {
    setArray(
      Object.values(dictionary).sort((a, b) => {
        if (a.timestamp <= b.timestamp) return -1;
        else return 1;
      })
    );
  }, [dictionary]);

  return { dictionary, array };
};

export default useMessages;
