var slidesData = [
	{
		id: 1,
		statement: `"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quas provident repellat reiciendis.
						Adipisci veniam in eos similique nulla officia."`,
		logoURL: "/assets/avatar-1.png",
		name: "Charlie Hamilton",
		designation: "Software Engineer at Bayt.com",
		buttonText: "Open Profile",
	},
	{
		id: 2,
		statement: `"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quas provident repellat reiciendis.
						Adipisci veniam in eos similique nulla officia."`,
		logoURL: "/assets/avatar-2.png",
		name: "Hanna Bekker",
		designation: "Assistant Director at Education Ministry",
		buttonText: "Open Profile",
	},
	{
		id: 3,
		statement: `"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quas provident repellat reiciendis.
						Adipisci veniam in eos similique nulla officia."`,
		logoURL: "/assets/avatar-3.png",
		name: "Maria Kert",
		designation: "Store Supervisor at Amazon",
		buttonText: "Open Profile",
	},
];

class Slider {
	constructor(sliderContainer, slidesData, options) {
		this.sliderContainer = sliderContainer;
		this.slidesData = slidesData;
		this.sliderContainer;
		this.slider;
		this.previousButton;
		this.nextButton;
		this.navigationDotsContainer;
		this.autoPlayIntervalInstance = null;
		this.defaultAutoPlayIntervalDuration = 1000;
		this.options = options || {};
		this.activeSlideIndex = 0;
		this.navigationDots = [];
		this.slides = [];
		this.startX;
		this.endX;

		this.setup();
	}

	setup() {
		this.setupSliderContainer();
		this.setupSlides();
		this.setupNavigation();
		this.setupAutoPlay();
		this.setupSwipe();
		this.injectSliderContainerIntoDOM();
	}

	injectSliderContainerIntoDOM() {
		this.sliderContainer.classList.add("slider-container");
	}

	setupSliderContainer() {
		let sliderNode = document.createElement("div");
		sliderNode.classList.add("slider");
		this.slider = sliderNode;

		let previousButtonNode = document.createElement("button");
		previousButtonNode.classList.add("button", "previous-button", "nav-button", "greyscale");
		this.previousButton = previousButtonNode;

		let previousButtonNodeIcon = document.createElement("img");
		previousButtonNodeIcon.setAttribute("src", "./assets/back-arrow.svg");
		previousButtonNodeIcon.setAttribute("alt", "Back Arrow");

		previousButtonNode.appendChild(previousButtonNodeIcon);

		let nextButtonNode = document.createElement("button");
		nextButtonNode.classList.add("button", "next-button", "nav-button", "greyscale");
		this.nextButton = nextButtonNode;

		let nextButtonNodeIcon = document.createElement("img");
		nextButtonNodeIcon.setAttribute("src", "./assets/arrow-forward.svg");
		nextButtonNodeIcon.setAttribute("alt", "Next Arrow");

		nextButtonNode.appendChild(nextButtonNodeIcon);

		let navigationDotsNode = document.createElement("div");
		navigationDotsNode.classList.add("dots");
		this.navigationDotsContainer = navigationDotsNode;

		let childrenNodes = [sliderNode, previousButtonNode, nextButtonNode, navigationDotsNode];

		childrenNodes.forEach((childNode) => {
			this.sliderContainer.appendChild(childNode);
		});
	}

	setupSlides() {
		this.slidesData.forEach(({ statement, logoURL, name, designation, buttonText }, index) => {
			let newSlide = this.createNewSlide({ statement, logoURL, name, designation, buttonText, index });
			this.slides.push(newSlide);
			this.slider.appendChild(newSlide);
		});

		this.slider.style.width = `${this.slides.length * 100}%`;
	}

	createNewSlide({ statement, logoURL, name, designation, buttonText, index }) {
		let newSlideNode = document.createElement("div");
		newSlideNode.classList.add("slide");
		newSlideNode.classList.add(`slide-${index}`);

		let newSlideStatementNode = document.createElement("div");
		newSlideStatementNode.classList.add("statement");

		let newSlideStatementNodeInnerText = document.createTextNode(statement);

		let newSlideLogoNode = document.createElement("div");
		newSlideLogoNode.classList.add("logo");

		let newSlideLogoNodeImage = document.createElement("img");
		newSlideLogoNodeImage.setAttribute("src", logoURL);
		newSlideLogoNodeImage.setAttribute("alt", "Avatar");

		let newSlideInfoNode = document.createElement("div");
		newSlideInfoNode.classList.add("info");

		let newSlideInfoNameNode = document.createElement("div");
		newSlideInfoNameNode.classList.add("name");

		let newSlideInfoNameNodeInnerText = document.createTextNode(name);

		let newSlideInfoDesignationNode = document.createElement("div");
		newSlideInfoDesignationNode.classList.add("designation");

		let newSlideInfoDesignationNodeInnerText = document.createTextNode(designation);

		let newSlideButtonNode = document.createElement("div");
		newSlideButtonNode.classList.add("slide__Button");

		let newSlideButton = document.createElement("button");
		newSlideButton.classList.add("button", "button-primary", "button-regular");

		let newSlideButtonInnerText = document.createTextNode(buttonText);

		newSlideButton.appendChild(newSlideButtonInnerText);
		newSlideButtonNode.appendChild(newSlideButton);
		newSlideInfoNameNode.appendChild(newSlideInfoNameNodeInnerText);
		newSlideInfoDesignationNode.appendChild(newSlideInfoDesignationNodeInnerText);
		newSlideInfoNode.appendChild(newSlideInfoNameNode);
		newSlideInfoNode.appendChild(newSlideInfoDesignationNode);
		newSlideLogoNode.appendChild(newSlideLogoNodeImage);
		newSlideStatementNode.appendChild(newSlideStatementNodeInnerText);

		let childrenNodes = [newSlideStatementNode, newSlideLogoNode, newSlideInfoNode, newSlideButtonNode];

		childrenNodes.forEach((child) => {
			newSlideNode.appendChild(child);
		});

		return newSlideNode;
	}

	setupNavigation() {
		this.previousButton.addEventListener("click", () => {
			this.prevSlide();
		});
		this.nextButton.addEventListener("click", () => {
			this.nextSlide();
		});

		this.createNavigationDots();

		if (this.navigationDots.length > 0) this.navigationDots[this.activeSlideIndex].classList.add("active");
	}

	setupSwipe() {
		this.slider.addEventListener("touchstart", (event) => {
			this.startX = event.touches[0].clientX;
		});

		this.slider.addEventListener("touchend", (event) => {
			this.endX = event.changedTouches[0].clientX;
			this.handleSwipe();
		});
	}

	handleSwipe() {
		const threshold = 50;
		const distance = this.endX - this.startX;
		if (Math.abs(distance) > threshold) {
			if (distance > 0) {
				this.prevSlide();
			} else {
				this.nextSlide();
			}
		}
	}

	createNavigationDots() {
		if (this.slides.length > 0) {
			for (let index = 0; index < this.slides.length; index++) {
				let navigationDotButton = document.createElement("button");
				navigationDotButton.classList.add("dot", "button", "greyscale");

				let navigationDotIcon = document.createElement("img");
				navigationDotIcon.setAttribute("src", "./assets/dot.svg");
				navigationDotIcon.setAttribute("alt", "Navigation Dot");

				navigationDotButton.appendChild(navigationDotIcon);
				this.navigationDotsContainer.appendChild(navigationDotButton);

				this.setupNavigationDots(navigationDotButton, index);
				this.navigationDots.push(navigationDotButton);
			}
		}
	}

	setupNavigationDots(navigationDotButton, index) {
		navigationDotButton.addEventListener("click", () => {
			this.activeSlideIndex = index;
			this.setActiveSlide();
		});
	}

	setupAutoPlay() {
		if (this.options.autoPlay) this.setupInterval();
	}

	prevSlide() {
		this.activeSlideIndex = (this.activeSlideIndex - 1 + this.slides.length) % this.slides.length;
		this.setActiveSlide();
	}

	nextSlide() {
		this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
		this.setActiveSlide();
	}

	setActiveSlide() {
		this.clearInterval();
		this.slider.style.transform = `translateX(-${(this.activeSlideIndex * 100) / this.slides.length}%)`;

		this.navigationDots.forEach((dotButton) => {
			dotButton.classList.remove("active");
		});

		this.navigationDots[this.activeSlideIndex].classList.add("active");

		if (this.options.autoPlay) this.setupInterval();
	}

	setupInterval() {
		this.autoPlayIntervalInstance = setInterval(() => {
			this.nextSlide();
		}, this.options.autoPlayIntervalDuration || this.defaultAutoPlayIntervalDuration);
	}

	clearInterval() {
		clearInterval(this.autoPlayIntervalInstance);
	}
}

const slider = new Slider(document.querySelector("#root"), slidesData, {
	autoPlay: true,
	autoPlayIntervalDuration: 2000,
});
