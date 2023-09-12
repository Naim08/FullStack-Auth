class Api::UsersController < ApplicationController
    wrap_parameters include: User.attribute_names + ["password"]

    before_action :require_logged_out, only: [:create]

    def create
        @user = User.new(user_params)
        debugger
        if @user.save
            login(@user)
            debugger
            render :show
        else
            render json: @user.errors.full_messages, status: 422
        end
    end

    private

    def user_params
        params.require(:user).permit(:username, :password)
    end
end
