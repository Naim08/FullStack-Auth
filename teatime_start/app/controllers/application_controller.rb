class ApplicationController < ActionController::API

    include ActionController::RequestForgeryProtection

    protect_from_forgery with: :exception

    before_action :attach_authenticity_token, :snake_case_params

    def current_user
        @current_user ||= User.find_by(session_token: session[:session_token])
    end

    def require_logged_in
        if !logged_in?
            render json: { errors: ['Must be logged in'] }, status: :unauthorized
        end
    end

    def require_logged_out
        if logged_in?
            render json: { errors: ['Must be logged out'] }, status: 403
        end
    end

    def logged_in?
        !!current_user
    end

    def login(user)
        debugger
        session[:session_token] = user.reset_session_token!
        @current_user = user
    end

    def logout
        current_user.reset_session_token! # unless logged_in?
        session[:session_token] = nil
        @current_user = nil
    end

    private

    def snake_case_params
        params.deep_transform_keys!(&:underscore)
    end

    def attach_authenticity_token
        headers['X-CSRF-Token'] = masked_authenticity_token(session)
    end
end
