class BookingController:
    instance = None
    def __init__(self, booking_count):
        self.bookings = {i:None for i in range(booking_count)}
    
    @classmethod
    async def get_instance(cls, booking_count):
        if cls.instance is None:
            cls.instance = BookingController(booking_count)
        return cls.instance
    
    async def check_availability(self, booking_id):
        return self.bookings[booking_id] == None
    
    
    async def book(self, booking_id, user):
        if self.bookings[booking_id] == user:
            self.bookings[booking_id] = None
            return True
        elif self.bookings[booking_id] != None:
            return False
        # check if the user has already booked a slot then cancel it
        for key, value in self.bookings.items():
            if value == user:
                self.bookings[key] = None
        self.bookings[booking_id] = user
        return True


    async def cancel(self, booking_id):
        self.bookings[booking_id] = None

    async def cancel_user(self, user):
        for key, value in self.bookings.items():
            if value == user:
                self.bookings[key] = None

    async def get_bookings(self):
        return self.bookings
    
    
