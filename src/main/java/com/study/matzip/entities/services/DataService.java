package com.study.matzip.entities.services;

import com.study.matzip.entities.data.ReviewEntity;
import com.study.matzip.entities.data.ReviewImageEntity;
import com.study.matzip.entities.member.UserEntity;
import com.study.matzip.enums.data.AddReviewResult;
import com.study.matzip.exceptions.RollbackException;
import com.studymap.matzip.interfaces.IResult;
import com.study.matzip.mappers.IDataMapper;
import com.study.matzip.entities.data.PlaceEntity;
import com.study.matzip.vos.data.PlaceVo;
import com.study.matzip.vos.data.ReviewVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;

@Service(value = "com.study.matzip.controllers.DataService")
public class DataService {
    private final IDataMapper iDataMapper;

    @Autowired
    public DataService(IDataMapper iDataMapper) {
        this.iDataMapper = iDataMapper;
    }


    public PlaceVo[] getPlace(double minLat, double minLng, double maxLat, double maxLng) {
        return this.iDataMapper.selectPlacesExceptImage(minLat, minLng, maxLat, maxLng);
    }

    public PlaceEntity getPlace(int index) {
        return this.iDataMapper.selectPlacesByIndex(index);
    }


    @Transactional
    public Enum<? extends IResult> addReview(UserEntity user, ReviewEntity review, MultipartFile[] images) throws IOException, RollbackException {
        if (user == null) {
            return AddReviewResult.NOT_SIGNED;
        }
        review.setUserId(user.getId());
        if (this.iDataMapper.insertReview(review) == 0) {
            return AddReviewResult.FAILURE;
        }
        if (images != null && images.length > 0) {
            for (MultipartFile image : images) {
                ReviewImageEntity reviewImage = new ReviewImageEntity();
                reviewImage.setReviewIndex(review.getIndex());
                reviewImage.setData(image.getBytes());
                reviewImage.setType(image.getContentType());
                if (this.iDataMapper.insertReviewImage(reviewImage) == 0) {
                    throw new RollbackException();
                }
            }
        }
        return AddReviewResult.SUCCESS;
    }

    public ReviewVo[] getReviews(int placeIndex) {
        ReviewVo[] reviews = this.iDataMapper.selectReviewsByPlaceIndex(placeIndex);
        for (ReviewVo review : reviews) {
            ReviewImageEntity[] reviewImages = this.iDataMapper.selectReviewImagesByReviewIndexExceptData(review.getIndex());
            int[] reviewImageIndexes = Arrays.stream(reviewImages).mapToInt(ReviewImageEntity::getIndex).toArray();


//            int[] reviewImageIndexes = Arrays.stream(reviewImages).mapToInt(ReviewImageEntity::getIndex).toArray(); (밑에 3 개줄의 역할을 함)

//            int [] reviewImageIndexes = new int[reviewImages.length];
//            for (int i = 0; i < reviewImages.length; i++) {
//                reviewImageIndexes[i] =reviewImages[i].getIndex();
//            }
            review.setImagesIndexes(reviewImageIndexes);
        }
        return reviews;
    }

    public ReviewImageEntity geReviewImage(int index){
        return this.iDataMapper.selectReviewImageByIndex(index);
    }
}
