const PlayList = require('../models/playlist')
const Album = require('../models/album')
const User = require('../models/user')



exports.addNewPlaylist = async (req, res, next) => {
    const userId = req.user.id
    try{
        const title = req.body.title || 'test'
        const user = await User.findOne({where: {id: userId}})
        await user.createPlayList({ title: title})
        res.status(200).json({message: 'creating playlist'})

    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.getPlaylist = async (req, res, next) => {
    const userId = req.user.id
    try{
        const user = await User.findOne({where: { id: userId },
            include: { model: PlayList }})
        res.status(200).json({userId: userId, playlist: user.playlists})

    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.addNewAlbum = async(req, res, next) => {
    const userId = req.user.id
    try{
        const title = req.body.title || 'test'
        const user = await User.findOne({
            where: {id: userId},
            include: {model: Album}
        })
        if(user.albums.length < 2){
            await user.createAlbum({ title: title})
            res.status(200).json({message: 'creating album'})
        }else{
            res.status(405).json({message: "don't can creat album"})

        }

    }catch (err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}

exports.getAlbum = async() => {
    const userId = req.user.id
    try{
        const user = await User.findOne({where: { id: userId },
            include: { model: Album }})
        res.status(200).json({userId: userId, album: user.albums})

    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }

}