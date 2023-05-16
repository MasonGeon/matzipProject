package com.study.matzip.controllers;

import com.study.matzip.entities.data.ReviewImageEntity;
import com.study.matzip.exceptions.RollbackException;
import com.study.matzip.entities.data.PlaceEntity;
import com.study.matzip.entities.data.ReviewEntity;
import com.study.matzip.entities.member.UserEntity;
import com.study.matzip.entities.services.DataService;
import com.study.matzip.enums.data.AddReviewResult;
import com.study.matzip.vos.data.PlaceVo;
import com.study.matzip.vos.data.ReviewVo;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController(value = " com.study.matzip.controllers;")
@RequestMapping(value = "data")
public class DataController {

    private final DataService dataService;

    @Autowired
    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping(value = "place", produces = MediaType.APPLICATION_JSON_VALUE)
    public PlaceVo[] getPlace(@RequestParam(value = "minLat") double minLat,
                              @RequestParam(value = "minLng") double minLng,
                              @RequestParam(value = "maxLat") double maxLat,
                              @RequestParam(value = "maxLng") double maxLng) {
        return this.dataService.getPlace(minLat, minLng, maxLat, maxLng);
    }

    //이미지 불러오는 컨트롤러
    @GetMapping(value = "placeImage")
    public ResponseEntity<byte[]> getPlaceImage(@RequestParam(value = "pi") int index) {
        ResponseEntity<byte[]> responseEntity;
        PlaceEntity place = this.dataService.getPlace(index);
        if (place == null) {
            responseEntity = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf(place.getImageType()));
            headers.setContentLength(place.getImage().length);
            responseEntity = new ResponseEntity<>(place.getImage(), HttpStatus.OK);
        }
        return responseEntity;
    }

    @GetMapping(value = "review", produces = MediaType.APPLICATION_JSON_VALUE)
    public ReviewVo[] getReview(@RequestParam(value = "pi") int placeIndex) {
        return this.dataService.getReviews(placeIndex);
    }


    @PostMapping(value = "review")
    @ResponseBody
    public String postReview(@SessionAttribute(value = "user") UserEntity user,
                             @RequestParam(value = "images", required = false) MultipartFile[] images,
                             ReviewEntity review) throws IOException {
        JSONObject responseObject = new JSONObject();
        Enum<?> result;
        try {
            result = this.dataService.addReview(user, review, images);
        } catch (RollbackException ignored) {
            result = AddReviewResult.FAILURE;
        }
        System.out.println('췍');
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @GetMapping(value = "reviewImage")
    public ResponseEntity<byte[]> getReviewImage(@RequestParam(value = "index") int index) {
        ResponseEntity<byte[]> responseEntity;
        ReviewImageEntity reviewImage = this.dataService.geReviewImage(index);
        if (reviewImage == null) {
            responseEntity = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf(reviewImage.getType()));
            headers.setContentLength(reviewImage.getData().length);
            responseEntity = new ResponseEntity<>(reviewImage.getData(), HttpStatus.OK);
        }
        return responseEntity;
    }
}
