class PublishingAPIUpdater
  include Sidekiq::Worker

  def perform(edition_id, update_type = "minor")
    edition = Edition.find(edition_id)
    presenter = PublishedEditionPresenter.new(edition)
    document_for_publishing_api = presenter.render_for_publishing_api(republish: update_type == "republish")
    content_id = document_for_publishing_api[:content_id]

    Services.publishing_api.put_content(content_id, document_for_publishing_api)
  end
end