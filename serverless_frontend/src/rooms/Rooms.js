const { default: axios } = require("axios")


const deluxe = {
    101: false,
    102: false,
    103: false,
    104: false,
    105: false
}

const suite = {
    106: false,
    107: false,
    108: false,
    109: false,
    110: false
}

const family_room = {
    111: false,
    112: false,
    113: false,
    114: false,
    115: false
}

export async function getAvailableRooms(from_date, to_date) {

    const requestBody = {
        "date_from": from_date,
        "date_to": to_date
    }
    let availableRooms = {}

    await axios.post('https://b2oyp36udfmiumo4dipadmlqqe0xmvwl.lambda-url.us-east-1.on.aws/', requestBody).then((response) => {
        if (response.status === 200) {
            // console.log(response.data);
            const roomDetails = response.data.room_details;
            const count = response.data.count;

            let roomNo, roomType;
            for (let i in roomDetails) {
                roomNo = roomDetails[i]['room_number']
                roomType = roomDetails[i]['room_type']
                switch (roomType) {
                    case 'deluxe':
                        deluxe[roomNo] = true;
                        break;
                    case 'suite':
                        suite[roomNo] = true;
                        break;
                    case 'family_room':
                        family_room[roomNo] = true;
                        break;
                }
            }

            let deluxeRooms = []
            for (let d in deluxe) {
                if (deluxe[d] === true) {
                    deluxeRooms.push(d);
                }
            }
            availableRooms['deluxe'] = deluxeRooms;

            let suiteRooms = []
            for (let s in suite) {
                if (suite[s] === true) {
                    suiteRooms.push(s);
                }
            }
            availableRooms['suite'] = suiteRooms;

            let familyRoom = []
            for (let f in family_room) {
                if (family_room[f] === true) {
                    familyRoom.push(f);
                }
            }

            availableRooms['family_room'] = familyRoom;
            // console.log(availableRooms);            
        } else {
            console.log('Unexpected status code');
        }
    }).catch((err) => {
        console.log(err);
    });

    return availableRooms;
}


