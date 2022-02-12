import React from "react";
import { ISolution } from "../interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import { Badge } from "primereact/badge";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";

import "../styles/Solutions.scss";
import Spinner from "./Spinner";

interface ISolutionsProps {
	displaySolutions: ISolution[];
	targetRating: number | undefined;
	columnDefinitions: number[];
	totalSolutionsCount: number | null; // null means that calculation has not started yet
	isCalculating: boolean;
	fetchMoreSolutions: (fromIndex: number) => void;
}

export function Solutions({
	displaySolutions,
	targetRating,
	columnDefinitions,
	totalSolutionsCount,
	isCalculating,
	fetchMoreSolutions
}: ISolutionsProps) {
	const loadingTemplate = () => {
		return isCalculating ? <></> : <Loading />;
	};

	const ratingTemplate = (numOfRatings: number) => {
		return <span>{numOfRatings}</span>;
	};

	const priceTemplate = (price: number) => {
		return <span>{price}</span>;
	};

	const columns = columnDefinitions.map((cd) => {
		return (
			<Column
				key={cd}
				field="ratings"
				header={cd}
				body={(rowData) =>
					ratingTemplate(
						rowData.ratings.filter((rating: number) => rating === cd).length
					)
				}
			/>
		);
	});

	return (
		<div className="solutions">
			<h2>
				Solutions{" "}
				{(totalSolutionsCount || 0) > 0 && (
					<Badge value={totalSolutionsCount} size="large" />
				)}
			</h2>
			<small>
				Each row in this table shows how many players of each rating you must
				acquire in order to achieve the target rating
				{targetRating && (
					<>
						{" "}
						of <strong>{targetRating}</strong>
					</>
				)}
			</small>

			{/* <DataTable
				className="p-mt-4"
				value={displaySolutions}
				stripedRows
				responsiveLayout="scroll"
				emptyMessage="No solutions"
				rowHover
				scrollable
				scrollHeight="600px">
				{[
					...columns,
					<Column
						key="price"
						field="price"
						header="Price"
						body={(rowData) => priceTemplate(rowData.price)}
					/>
				]}
			</DataTable> */}

			<InfiniteScroll
				dataLength={displaySolutions.length}
				next={
					isCalculating
						? () => -1
						: () => fetchMoreSolutions(displaySolutions.length)
				}
				hasMore={
					!isCalculating && (totalSolutionsCount || 0) > displaySolutions.length
				}
				loader={isCalculating ? <></> : <Loading />}
				className="infinite-scroll">
				<table className="p-mt-3 solutions-table">
					<thead className="sticky-header">
						<tr>
							{columnDefinitions.map((cd, index) => (
								<RatingCell key={index} isHeader value={cd} />
							))}
							<PriceCell value="Price" isHeader />
						</tr>
					</thead>
					<tbody>
						{displaySolutions.map((solution) => (
							<tr key={solution.id}>
								{columnDefinitions.map((columnDefinition, columnIndex) => (
									<RatingCell
										key={`row${solution.id}col${columnIndex}`}
										value={
											solution.ratings.filter(
												(rating) => rating === columnDefinition
											).length
										}
									/>
								))}
								<PriceCell value={solution.price} />
							</tr>
						))}
						{displaySolutions.length === 0 && (
							<tr>
								{columnDefinitions.map((_, index) => (
									<RatingCell key={index} value={0} />
								))}
								<PriceCell value={0} />
							</tr>
						)}
					</tbody>
				</table>
			</InfiniteScroll>

			{totalSolutionsCount !== null && totalSolutionsCount === 0 && (
				<Message
					severity="error"
					text="No possible solutions exist — Try again with a different configuration"
					className="p-my-5"
				/>
			)}

			{isCalculating && (totalSolutionsCount || 0) > displaySolutions.length && (
				<Message
					severity="warn"
					text={`Only the cheapest ${displaySolutions.length} solutions are shown
                    while calculating`}
					className="p-my-5"
				/>
			)}

			{/* <Collapse
				in={
					isCalculating && (totalSolutionsCount || 0) > displaySolutions.length
				}>
				<div>
					<Alert variant="warning">
						Only the cheapest {displaySolutions.length} solutions are shown
						while calculating
					</Alert>
				</div>
			</Collapse>

			<Collapse in={totalSolutionsCount !== null && totalSolutionsCount === 0}>
				<div>
					<Alert variant="danger">
						No possible solutions exist — Try again with a different
						configuration
					</Alert>
				</div>
			</Collapse> */}
		</div>
	);
}

const Loading = () => {
	return (
		<div className="loader-container">
			<Spinner.Ellipsis />
			<h5>Loading...</h5>
		</div>
	);
};

const PriceCell = ({
	isHeader = false,
	value
}: {
	isHeader?: boolean;
	value: number | string;
}) => {
	return <Cell type="price" isHeader={isHeader} value={value} />;
};

const RatingCell = ({
	isHeader = false,
	value
}: {
	isHeader?: boolean;
	value: number | string;
}) => {
	return <Cell type="rating" isHeader={isHeader} value={value} />;
};

const Cell = ({
	type,
	isHeader,
	value
}: {
	type: "rating" | "price";
	isHeader: boolean;
	value: string | number;
}) => {
	const className = type === "rating" ? "rating-cell" : "price-cell";
	if (isHeader) {
		return <th className={`${className}`}>{value}</th>;
	} else {
		return (
			<td className={className}>
				<span className={value === 0 ? "text-muted" : ""}>{value}</span>
			</td>
		);
	}
};
