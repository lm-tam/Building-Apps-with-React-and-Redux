import * as types from "./actionTypes";
import * as courseApi from "../../api/courseApi";
import { beginApiCall, apiCallErrors } from "./ApiStatusActions";

// Action creator
export function createCourse(course) {
    return {
        type: types.CREATE_COURSE,
        course
    }
}

export function loadCourseSuccess(courses) {
    return {
        type: types.LOAD_COURSES_SUCCESS,
        courses
    }
}

export function updateCourseSuccess(course) {
    return {
        type: types.UPDATE_COURSES_SUCCESS,
        course
    }
}

export function loadCourses() {
    return function (dispatch) {
        dispatch(beginApiCall());
        return courseApi.getCourses().then(courses => {
            dispatch(loadCourseSuccess(courses));
        }).catch(error => {
            dispatch(apiCallErrors())
            throw error;
        })
    }
}

export function saveCourse(course) {
    return function (dispatch) {
        dispatch(beginApiCall());
        return courseApi.saveCourse(course)
            .then(savedCourse => {
                course.id ?
                    dispatch(updateCourseSuccess(savedCourse)) :
                    dispatch(createCourse(savedCourse));
            }).catch(error => {
                dispatch(apiCallErrors())
                throw error
            })
    }
}

export function deleteCourseOptimistic(course) {
    return {
        type: types.DELETE_COURSE_OPTIMISTIC,
        course
    }
}

export function deleteCourse(course) {
    return function (dispatch) {
        // Doing optimistic delete, so not dispatching begin/end api call
        // actions, or apiCallErrors actions since we're not showing the loading status for this.
        dispatch(deleteCourseOptimistic(course));
        return courseApi.deleteCourse(course.id);
    }
}