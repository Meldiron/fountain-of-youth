<script lang="ts">
	import { goto } from '$app/navigation';
	import { account } from '$lib';

	let loading = false;
	let msg = '';
	let email = '';
	let code = '';
	let flow = 'step1';
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

{#if flow === 'step1'}
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
	  <p>We sent a link to {email} with security phrase: <code class="inline-code">{securityPhrase}</code></p>
	</div>
  </section>
  {/if}

  
	<article class="card common-section" role="generic" style="overflow: hidden;">
		<form on:submit={signInFinish} class="form common-section">
			<ul class="form-list" style="--form-list-gap: 1.5rem;">
				<li class="form-item">
					<h5 class="heading-level-5" style=" margin-top: -8px;">Sign in</h5>
					<p style="margin-bottom: 24px; margin-top: 4px;">
						Please ceck your inbox and enter 6-digit code below.
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
{/if}
