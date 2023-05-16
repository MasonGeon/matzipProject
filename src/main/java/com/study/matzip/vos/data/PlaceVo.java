package com.study.matzip.vos.data;

import com.study.matzip.entities.data.PlaceEntity;

public class PlaceVo extends PlaceEntity {

    private double score;

    public double getScore() {
        return score;
    }

    public PlaceVo setScore(double score) {
        this.score = score;
        return this;
    }
}
