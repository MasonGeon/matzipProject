package com.study.matzip.controllers;

import com.study.matzip.entities.member.UserEntity;
import com.study.matzip.entities.services.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller(value = "com.study.matzip.controllers.MemberController")
@RequestMapping(value = "member")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping(value = "kakao", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getKakao(@RequestParam(value = "code") String code,
                                 @RequestParam(value = "error", required = false) String error,
                                 @RequestParam(value = "error_description", required = false) String errorDescription, HttpSession session) throws IOException {
        String accessToken = this.memberService.getKakaoAccessToken(code);
        UserEntity user =  this.memberService.getKakaoUserInfo(accessToken);
        session.setAttribute("user",user);
        ModelAndView modelAndView = new ModelAndView("member/kakao");
        return modelAndView;
    }

    @GetMapping(value = "logout")
    public ModelAndView getLogout(HttpSession session){
        session.setAttribute("user",null);
        session.invalidate();
        return new ModelAndView("redirect:/");
    }
}
