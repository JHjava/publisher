require 'test_helper'

class Admin::UserSearchControllerTest < ActionController::TestCase
  setup do
    login_as_stub_user
  end

  test "should get index" do
    get :index
    assert_response :success
  end

  test "should show commented editions" do
    @guide = FactoryGirl.create(:guide_edition)
    FactoryGirl.create(:guide_edition)

    @user.record_note @guide, "I like this edition very much"
    get :index

    assert_response :success
    assert_equal [@guide.id], assigns[:editions].map(&:id)
  end

  test "should show assigned editions" do
    @guide = FactoryGirl.create(:guide_edition) do |edition|
      @user.assign(edition, @user)
    end

    get :index

    assert_response :success
    assert_equal [@guide.id], assigns[:editions].map(&:id)
  end
end
