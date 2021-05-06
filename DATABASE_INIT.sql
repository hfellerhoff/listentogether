create table songs (
    id    integer primary key NOT NULL ,
    room_id integer NOT NULL , 
    spotifyUri  varchar NOT NULL ,
    progress bigint NOT NULL DEFAULT 0 ,
    isPaused boolean NOT NULL DEFAULT "true" ,
    updatedAt integer DEFAULT NOW() ,
    addedAt integer DEFAULT NOW() ,
) ;