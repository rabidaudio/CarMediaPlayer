currently:
    buffer -> through -> deoder -> speaker

pausing kills the speaker, and makes a new one

resuming connects the decoder to the new soeaker

stop kills the speaker but doesn't create a new one




*   Changes: States are strings and events

    Player should take in Song object returned from library

    Speaker should use unshift() (or whatever) on pause

    