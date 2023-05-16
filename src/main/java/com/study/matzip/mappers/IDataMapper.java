package com.study.matzip.mappers;

import com.study.matzip.entities.data.PlaceEntity;
import com.study.matzip.entities.data.ReviewEntity;
import com.study.matzip.entities.data.ReviewImageEntity;
import com.study.matzip.vos.data.PlaceVo;
import com.study.matzip.vos.data.ReviewVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Mapper
public interface IDataMapper {
    int insertReview(ReviewEntity review);

    int insertReviewImage(ReviewImageEntity reviewImage);

    PlaceVo[] selectPlacesExceptImage(@Param(value = "minLat")double minLat,
                                      @Param(value = "minLng")double minLng,
                                      @Param(value = "maxLat")double maxLat,
                                      @Param(value = "maxLng")double maxLng);

    PlaceEntity selectPlacesByIndex(@Param(value = "index")int index);

    ReviewVo[] selectReviewsByPlaceIndex(@Param(value = "placeIndex")int placeIndex);

    ReviewImageEntity selectReviewImageByIndex(@Param(value = "index")int index);

    ReviewImageEntity[] selectReviewImagesByReviewIndexExceptData(@Param(value = "reviewIndex")int reviewIndex);
}
