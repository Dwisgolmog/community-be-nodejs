const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../Controllers/userController');
const cookie = require('../middlewares/checkCookie');

//NOTE: 이미지 저장소 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../resource/profileImg'));
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + '-' + Math.random() + path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    if (extName) {
        cb(null, true);
    } else {
        cb(new Error('이미지 파일만 업로드 가능합니다!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter,
});

router.post('/login', userController.login);
router.post('/signup', upload.single('profile_img'), userController.signup);
router.post('/logout', cookie.checkCookie, userController.logout);
//NOTE:회원 정보 조회
router.get('', cookie.checkCookie, userController.getUser);
//NOTE:회원 정보 수정
router.patch(
    '',
    cookie.checkCookie,
    upload.single('profile_img'),
    userController.editUser
);

//NOTE:회원 비밀번호 수정
router.patch('/password', cookie.checkCookie, userController.editPwd);
//NOTE:회원 탈퇴
router.delete('', cookie.checkCookie, userController.delUser);
module.exports = router;
