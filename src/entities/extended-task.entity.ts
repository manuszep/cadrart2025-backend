import { ECadrartArticleFamily, ECadrartJobMeasureType, ECadrartJobOrientation, ECadrartOfferStatus, ICadrartLocation } from "@manuszep/cadrart2025-common";
import { ViewEntity, ViewColumn } from "typeorm"

@ViewEntity({
  name: 'extendedTask',
  expression: `
    SELECT
      task.id AS id,
      task.comment AS taskComment,
      task.total AS taskTotal,
      task.image AS taskImage,
      task.doneCount AS taskDoneCount,
      task.parentId AS parentId,
      job.id AS jobId,
      job.count AS jobCount,
      job.orientation AS jobOrientation,
      job.measure AS jobMeasure,
      job.dueDate AS jobDueDate,
      job.startDate AS jobStartDate,
      job.openingWidth AS jobOpeningWidth,
      job.openingHeight AS jobOpeningHeight,
      job.marginWidth AS jobMarginWidth,
      job.marginHeight AS jobMarginHeight,
      job.glassWidth AS jobGlassWidth,
      job.glassHeight AS jobGlassHeight,
      job.description AS jobDescription,
      job.image AS jobImage,
      job.location AS jobLocation,
      JSON_EXTRACT(task.article, "$.id") AS articleId,
      JSON_EXTRACT(task.article, "$.name") AS articleName,
      JSON_EXTRACT(task.article, "$.place") AS articlePlace,
      JSON_EXTRACT(task.article, "$.family") AS articleFamily,
      originalArticle.outOfStock AS articleOutOfStock,
      offer.id AS offerId,
      offer.status AS offerStatus,
      JSON_EXTRACT(offer.assignedTo, "$.id") AS assignedToId,
      JSON_EXTRACT(offer.assignedTo, "$.firstName") AS assignedToFirstName,
      JSON_EXTRACT(offer.assignedTo, "$.lastName") AS assignedToLastName,
      JSON_EXTRACT(offer.client, "$.id") AS clientId,
      JSON_EXTRACT(offer.client, "$.firstName") AS clientFirstName,
      JSON_EXTRACT(offer.client, "$.lastName") AS clientLastName
    FROM offer AS offer
    LEFT JOIN job AS job ON offer.id = job.offerId
    LEFT JOIN task AS task ON job.id = task.jobId
    LEFT JOIN article AS originalArticle ON originalArticle.id = JSON_EXTRACT(task.article, "$.id")
    WHERE offer.status = "1"
  `,
})
export class CadrartExtendedTask {
    @ViewColumn()
    id: number;

    @ViewColumn()
    taskComment: string;

    @ViewColumn()
    taskTotal: number;

    @ViewColumn()
    taskImage: string;

    @ViewColumn()
    taskDoneCount: number;

    @ViewColumn()
    parentId: number | null;

    @ViewColumn()
    jobId: number;

    @ViewColumn()
    jobCount: number;

    @ViewColumn()
    jobOrientation: ECadrartJobOrientation;

    @ViewColumn()
    jobMeasure: ECadrartJobMeasureType;

    @ViewColumn()
    jobDueDate: Date;

    @ViewColumn()
    jobStartDate: Date;

    @ViewColumn()
    jobOpeningWidth: number;

    @ViewColumn()
    jobOpeningHeight: number;

    @ViewColumn()
    jobMarginWidth: number;

    @ViewColumn()
    jobMarginHeight: number;

    @ViewColumn()
    jobGlassWidth: number;

    @ViewColumn()
    jobGlassHeight: number;

    @ViewColumn()
    jobDescription: string;

    @ViewColumn()
    jobImage: string;

    @ViewColumn()
    jobLocation: ICadrartLocation;

    @ViewColumn()
    articleId: number;

    @ViewColumn()
    articleName: string;

    @ViewColumn()
    articlePlace: string;

    @ViewColumn()
    articleFamily: ECadrartArticleFamily;

    @ViewColumn()
    articleOutOfStock: boolean;

    @ViewColumn()
    offerId: number;

    @ViewColumn()
    offerStatus: ECadrartOfferStatus;

    @ViewColumn()
    assignedToId: number;

    @ViewColumn()
    assignedToFirstName: string;

    @ViewColumn()
    assignedToLastName: string;

    @ViewColumn()
    clientId: number;

    @ViewColumn()
    clientFirstName: string;

    @ViewColumn()
    clientLastName: string;
}