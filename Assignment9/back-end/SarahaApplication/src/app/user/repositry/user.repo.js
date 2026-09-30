import {User} from '../model/user.model.js'

export async function updateUserByEmail(email,UpdatedData) {
    return await User.findOneAndUpdate(
        {email : email},
        UpdatedData,
        {returnDocument: 'after'}
    )
}