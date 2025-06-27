import {
  ECadrartArticleFamily,
  ICadrartExtendedTask,
  ICadrartJob,
  ICadrartOffer,
  ICadrartTask
} from '@manuszep/cadrart2025-common';

function mapTaskToExtendedTask(
  task: ICadrartTask,
  job: ICadrartJob,
  offer: ICadrartOffer,
  rawTasks?: ICadrartTask[],
  allowNesting = true
): ICadrartExtendedTask {
  const jobTasks = !allowNesting
    ? []
    : rawTasks.map((jobTask) => mapTaskToExtendedTask(jobTask, job, offer, rawTasks, false));

  return {
    id: task.id,
    taskComment: task.comment,
    taskTotal: task.total,
    taskImage: task.image,
    taskDoneCount: task.doneCount,
    parent: task.parent ? mapTaskToExtendedTask(task.parent, job, offer, rawTasks, false) : null,
    jobId: job.id,
    jobTasks: jobTasks,
    jobCount: job.count,
    jobOrientation: job.orientation,
    jobMeasure: job.measure,
    jobDueDate: job.dueDate,
    jobStartDate: job.startDate,
    jobOpeningWidth: job.openingWidth,
    jobOpeningHeight: job.openingHeight,
    jobMarginWidth: job.marginWidth,
    jobMarginHeight: job.marginHeight,
    jobGlassWidth: job.glassWidth,
    jobGlassHeight: job.glassHeight,
    jobDescription: job.description,
    jobImage: job.image,
    jobLocation: job.location?.name,
    articleId: task.article.id,
    articleName: task.article.name,
    articlePlace: task.article.place,
    articleFamily: task.article.family,
    offerId: offer.id,
    offerStatus: offer.status,
    assignedToId: offer.assignedTo.id,
    assignedToFirstName: offer.assignedTo.firstName,
    assignedToLastName: offer.assignedTo.lastName,
    clientId: offer.client.id,
    clientFirstName: offer.client.firstName,
    clientLastName: offer.client.lastName
  };
}

function extractTasksFromJob(offer: ICadrartOffer, job: ICadrartJob): ICadrartExtendedTask[] {
  const rawTasks: ICadrartTask[] = [];

  job.tasks.forEach((task: ICadrartTask) => {
    rawTasks.push(task);

    if (task.children) {
      task.children.forEach((child: ICadrartTask) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, ...parent } = task;

        rawTasks.push(Object.assign({ parent: parent }, child));
      });
    }
  });

  return rawTasks.map((task) => mapTaskToExtendedTask(task, job, offer, rawTasks));
}

function extractTasksFromOffer(offer: ICadrartOffer): ICadrartExtendedTask[] {
  let tasks: ICadrartExtendedTask[] = [];

  offer.jobs?.forEach((job) => {
    if (!job.tasks) {
      return;
    }

    const jobTasks = extractTasksFromJob(offer, job);

    tasks = [...tasks, ...jobTasks];
  });

  return tasks;
}

export function extractTasksFromOffers(
  articleFamily: ECadrartArticleFamily,
  offers: ICadrartOffer[]
): ICadrartExtendedTask[] {
  let tasks: ICadrartExtendedTask[] = [];

  offers.forEach((offer) => {
    const offerTasks = extractTasksFromOffer(offer);

    tasks = [...tasks, ...offerTasks];
  });

  return tasks.filter((task) => task.articleFamily === articleFamily);
}
