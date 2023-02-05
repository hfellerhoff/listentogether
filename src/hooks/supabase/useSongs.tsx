import { useEffect, useMemo, useState } from 'react';

import Song from '../../models/Song';
import supabase from '../../util/supabase';

interface Dictionary<T> {
  [id: string]: T;
}

const useSongs = (roomID: number) => {
  const [dictionary, setDictionary] = useState<Dictionary<Song>>({});
  const array = useMemo(() => {
    return Object.values(dictionary).sort((a, b) => {
      if (a.addedAt <= b.addedAt) return -1;
      else return 1;
    });
  }, [dictionary]);

  const table = 'songs';
  const whereColumn = 'room_id';

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
        const updatedDictionary: Dictionary<Song> = data.reduce(
          (dict, element) => {
            dict[element['id']] = element;
            return dict;
          },
          {} as Dictionary<Song>
        );

        setDictionary(updatedDictionary);
      }
    };

    fetchData();
  }, [roomID]);

  useEffect(() => {
    const subscription = supabase
      .channel(`public:${table}-${roomID}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `${whereColumn}=eq.${roomID}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
            case 'UPDATE':
              if (payload.new[whereColumn] !== roomID) return;

              // ==== LOGIC FOR MULTIPLE SONGS ====
              setDictionary((d) => {
                return {
                  ...d,
                  [payload.new['id']]: payload.new,
                };
              });

              // ==== LOGIC FOR SINGLE SONG ====
              // setDictionary({
              //   [payload.new['id']]: payload.new,
              // });
              return;
            case 'DELETE':
              setDictionary((d) => {
                if (!d[payload.old.id]) return d;

                delete d[payload.old.id];

                return { ...d };
              });
              return;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomID]);

  return { dictionary, array };
};

export default useSongs;
