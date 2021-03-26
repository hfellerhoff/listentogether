import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Message from '../../models/Message';
import Song from '../../models/Song';
import { roomAtom } from '../../state/roomAtom';
import supabase from '../../util/supabase';

const useRoomMessages = () => {
  const [room] = useAtom(roomAtom);
  const [roomUserMessages, setRoomUserMessages] = useState<
    {
      message_id: number;
      room_id: number;
      user_id: number;
    }[]
  >();
  const [messages, setMessages] = useState<Message[]>();

  useEffect(() => {
    const fetchMessagesRoom = async () => {
      const roomMessageIds = await supabase
        .from('room_user_messages')
        .select('*')
        .eq('room_id', room.id);

      if (roomMessageIds.body.length > 0) {
        setRoomUserMessages(roomMessageIds.body);
      }
    };

    fetchMessagesRoom();
  }, [room]);

  //   useEffect(() => {
  //     const fetchSong = async () => {
  //       const songRes = await supabase.from('songs').select('*').eq('id', songId);

  //       if (songRes && songRes.body.length > 0) {
  //         setSong(songRes.body[0]);
  //       }
  //     };

  //     if (songId) fetchSong();
  //   }, [roomUserMessages]);

  //   useEffect(() => {
  //     const roomSongSubscription = supabase
  //       .from('room_song')
  //       .on('INSERT', (payload) => {
  //         if (payload.new) {
  //           setRoomId(payload.new.room_id);
  //           setSongId(payload.new.song_id);
  //         }
  //       })
  //       .subscribe();

  //     const songSubscription = supabase
  //       .from('songs')
  //       .on('*', (payload) => {
  //         switch (payload.eventType) {
  //           case 'INSERT':
  //             return;
  //           case 'UPDATE':
  //             if (payload.new.id === songId) {
  //               setSong(payload.new);
  //             }
  //             return;
  //           case 'DELETE':
  //             return;
  //         }
  //       })
  //       .subscribe();

  //     return () => {
  //       roomSongSubscription.unsubscribe();
  //       songSubscription.unsubscribe();
  //     };
  //   }, [songId]);

  return messages;
};

export default useRoomMessages;
