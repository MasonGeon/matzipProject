package com.study.matzip.vos.data;

import com.study.matzip.entities.data.ReviewEntity;

public class ReviewVo extends ReviewEntity {
    private String userNickname;
    private int[] imagesIndexes;

    public String getUserNickname() {
        return userNickname;
    }

    public ReviewVo setUserNickname(String userNickname) {
        this.userNickname = userNickname;
        return this;
    }

    public int[] getImagesIndexes() {
        return imagesIndexes;
    }

    public ReviewVo setImagesIndexes(int[] imagesIndexes) {
        this.imagesIndexes = imagesIndexes;
        return this;
    }
}
