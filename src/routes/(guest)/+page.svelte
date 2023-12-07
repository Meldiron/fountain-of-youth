<script lang="ts">
	import { goto } from '$app/navigation';
	import { account } from '$lib';
	import { functions } from '$lib/index2';

	let loading = false;
	let msg = '';
	let email = '';
	let nickname = '';
	let password = '';
	let code = '';
	let flow = 'step0';
	let userId = '';
	let securityPhrase = '';

	let securityPhraseModal = false;

	function closeSecurityPhrase() {
		securityPhraseModal = false;
	}

	async function signIn() {
		loading = true;

		try {
			const token = await account.createMagicURLSession('unique()', email, undefined, 'code', true);
			userId = token.userId;
			securityPhrase = token.securityPhrase;
			msg = '';
			flow = 'step2';
			securityPhraseModal = true;
		} catch (err: any) {
			msg = err.message;
		} finally {
			loading = false;
		}
	}

	async function signInMagicFinish() {
		await new Promise((resolve) => setTimeout(resolve, 500));
		goto('/user');
	}

	async function signInMagic() {
		loading = true;

		try {
			const response = await functions.createExecution('6571a81de4f9af882b23');
			if(response.responseStatusCode >= 400) {
				throw Error(response.responseBody);
			}
			msg = '';
			flow = 'step4';
		} catch (err: any) {
			msg = err.message;
		} finally {
			loading = false;
		}
	}

	async function signInFinish() {
		loading = true;

		try {
			await account.updateMagicURLSession(userId, code);
			goto('/user');
		} catch (err: any) {
			msg = err.message;
		} finally {
			loading = false;
		}
	}
</script>

{#if flow === 'step0'}
	<article class="card common-section" role="generic" style="overflow: hidden;">
		<div class="form common-section">
			<ul class="form-list" style="--form-list-gap: 1.5rem; display: flex;">
				<button
					on:click={() => (flow = 'step1')}
					class="button is-secondary"
					aria-label="Add new item"
					style="flex: 1; display: flex; justify-content: center;"
				>
					<span class="icon-mail" aria-hidden="true"></span>
					<span class="text">Sign in with email</span>
				</button>

				<button
					on:click={() => (flow = 'step3')}
					class="button is-secondary"
					aria-label="Add new item"
					style="flex: 1; display: flex; justify-content: center;"
				>
					<span class="icon-sparkles" aria-hidden="true"></span>
					<span class="text">Sign in with magic</span>
				</button>
			</ul>
			<!--<FormList>-->
		</div>
		<!--<Form>-->
	</article>
{:else if flow === 'step1'}
	<article class="card common-section" role="generic" style="overflow: hidden;">
		<form on:submit={signIn} class="form common-section">
			<ul class="form-list" style="--form-list-gap: 1.5rem;">
				<li class="form-item">
					<h5 class="heading-level-5" style=" margin-top: -8px;">Sign in</h5>
					<p style="margin-bottom: 24px; margin-top: 4px;">Let's get started.</p>

					<div
						style="margin-bottom: 24px; transform: scaleX(200%); border-block-end: solid .0625rem hsl(var(--color-border));"
					></div>

					<label class="label is-required" for="email">Email</label>
					<!--<Label>-->
					<div class="input-text-wrapper">
						<input
							bind:value={email}
							id="email"
							name="email"
							placeholder="Enter email"
							required={true}
							autocomplete="off"
							type="email"
							class="input-text"
						/>
					</div>
					{#if msg}
						<p class="helper u-margin-block-start-8 u-color-text-warning">
							<span aria-hidden="true" class="icon-exclamation"></span>
							<span class="text">{msg}</span>
						</p>
					{/if}
				</li>
				<!--<FormItem>--><!--<InputText>-->
				<button
					disabled={email === '' || loading}
					style="border-radius: 8px;"
					class="button is-full-width"
					type="submit">Next</button
				><!--<Button>-->
			</ul>
			<!--<FormList>-->
		</form>
		<!--<Form>-->
	</article>
{:else if flow === 'step3'}
	<article class="card common-section" role="generic" style="overflow: hidden;">
		<form on:submit={signInMagic} class="form common-section">
			<ul class="form-list" style="--form-list-gap: 1.5rem;">
				<li class="form-item">
					<h5 class="heading-level-5" style=" margin-top: -8px;">Sign in</h5>
					<p style="margin-bottom: 24px; margin-top: 4px;">Let's get started.</p>

					<div
						style="margin-bottom: 24px; transform: scaleX(200%); border-block-end: solid .0625rem hsl(var(--color-border));"
					></div>

					<label class="label is-required" for="nickname">Nickname</label>
					<!--<Label>-->
					<div class="input-text-wrapper">
						<input
							bind:value={nickname}
							id="nickname"
							name="nickname"
							placeholder="Enter nickname"
							required={true}
							autocomplete="off"
							type="nickname"
							class="input-text"
						/>
					</div>
					{#if msg}
						<p class="helper u-margin-block-start-8 u-color-text-warning">
							<span aria-hidden="true" class="icon-exclamation"></span>
							<span class="text">{msg}</span>
						</p>
					{/if}
				</li>
				<!--<FormItem>--><!--<InputText>-->
				<button
					disabled={nickname === '' || loading}
					style="border-radius: 8px;"
					class="button is-full-width"
					type="submit">Next</button
				><!--<Button>-->
			</ul>
			<!--<FormList>-->
		</form>
		<!--<Form>-->
	</article>
{:else if flow === 'step2'}
	{#if securityPhraseModal}
		<section class="alert-sticky is-info" style="position: fixed; top: 32px; right: 32px;">
			<button
				class="button is-text is-only-icon"
				style="--button-size:1.5rem;"
				aria-label="close alert"
				type="button"
				on:click={closeSecurityPhrase}
			>
				<span class="icon-x" aria-hidden="true"></span>
			</button>
			<div class="alert-sticky-image"><span class="icon-info" aria-hidden="true"></span></div>
			<div class="alert-sticky-content">
				<p>
					We sent a link to {email} with security phrase:
					<code class="inline-code">{securityPhrase}</code>
				</p>
			</div>
		</section>
	{/if}

	<article class="card common-section" role="generic" style="overflow: hidden;">
		<form on:submit={signInFinish} class="form common-section">
			<ul class="form-list" style="--form-list-gap: 1.5rem;">
				<li class="form-item">
					<h5 class="heading-level-5" style=" margin-top: -8px;">Sign in</h5>
					<p style="margin-bottom: 24px; margin-top: 4px;">
						Please check your inbox and enter 6-digit code below.
					</p>

					<div
						style="margin-bottom: 24px; transform: scaleX(200%); border-block-end: solid .0625rem hsl(var(--color-border));"
					></div>

					<label class="label is-required" for="code">Code</label>
					<!--<Label>-->
					<div class="input-text-wrapper">
						<input
							bind:value={code}
							id="code"
							name="code"
							placeholder="Enter code"
							required={true}
							autocomplete="off"
							type="text"
							class="input-text"
						/>
					</div>
					{#if msg}
						<p class="helper u-margin-block-start-8 u-color-text-warning">
							<span aria-hidden="true" class="icon-exclamation"></span>
							<span class="text">{msg}</span>
						</p>
					{/if}
				</li>
				<!--<FormItem>--><!--<InputText>-->

				<button
					disabled={code === '' || code.length < 6 || loading}
					style="border-radius: 8px;"
					class="button is-full-width"
					type="submit">Sign in</button
				><!--<Button>-->
			</ul>
			<!--<FormList>-->
		</form>
		<!--<Form>-->
	</article>
{:else if flow === 'step4'}
	<article class="card common-section" role="generic" style="overflow: hidden;">
		<form on:submit={signInMagicFinish} class="form common-section">
			<ul class="form-list" style="--form-list-gap: 1.5rem;">
				<li class="form-item">
					<h5 class="heading-level-5" style=" margin-top: -8px;">Sign in</h5>
					<p style="margin-bottom: 24px; margin-top: 4px;">Judges, prepare your phones.</p>

					<div
						style="margin-bottom: 24px; transform: scaleX(200%); border-block-end: solid .0625rem hsl(var(--color-border));"
					></div>

					<label class="label is-required" for="password">Password</label>
					<!--<Label>-->
					<div class="input-text-wrapper">
						<input
							bind:value={password}
							id="password"
							name="password"
							placeholder="Enter password"
							required={true}
							autocomplete="off"
							type="password"
							class="input-text"
						/>
					</div>
					{#if msg}
						<p class="helper u-margin-block-start-8 u-color-text-warning">
							<span aria-hidden="true" class="icon-exclamation"></span>
							<span class="text">{msg}</span>
						</p>
					{/if}
				</li>
				<!--<FormItem>--><!--<InputText>-->

				<button
					disabled={password === '' || loading}
					style="border-radius: 8px;"
					class="button is-full-width"
					type="submit">Sign in</button
				><!--<Button>-->
			</ul>
			<!--<FormList>-->
		</form>
		<!--<Form>-->
	</article>
{/if}
